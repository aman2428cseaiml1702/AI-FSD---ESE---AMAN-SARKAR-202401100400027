const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   POST api/ai/analyze
// @desc    AI Complaint Analyzer
// @access  Private
router.post('/analyze', auth, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ msg: 'Please provide complaint text to analyze' });
        }

        let priority = "Normal";
        let department = "General Administration";
        let summary = "The user has reported an issue.";
        let autoResponse = "Thank you for your complaint. We are looking into it.";

        if (process.env.OPENROUTER_API_KEY) {
            try {
                // Dynamic import for node-fetch if using older Node, or use global fetch in Node 18+
                const fetch = globalThis.fetch || (await import('node-fetch')).default;
                
                const prompt = `Analyze this civic complaint: "${text}". 
                Respond ONLY with a valid JSON object containing exactly these keys:
                "priority" (High, Medium, or Normal), 
                "department" (Suggest the best municipal department like Water Supply, Electricity, Sanitation, Roads, etc),
                "summary" (A 1-sentence summary of the issue),
                "autoResponse" (A polite 1-2 sentence automated response to the user).`;

                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": "meta-llama/llama-3-8b-instruct:free", // Free model on OpenRouter
                        "messages": [
                            {"role": "system", "content": "You are a helpful smart city complaint analyzer API. Always return valid JSON."},
                            {"role": "user", "content": prompt}
                        ],
                        "response_format": { "type": "json_object" }
                    })
                });

                const data = await response.json();
                if (data.choices && data.choices[0].message.content) {
                    const aiResult = JSON.parse(data.choices[0].message.content);
                    priority = aiResult.priority || priority;
                    department = aiResult.department || department;
                    summary = aiResult.summary || summary;
                    autoResponse = aiResult.autoResponse || autoResponse;
                }
            } catch (aiErr) {
                console.error("OpenRouter API Error:", aiErr);
                // Fallback to keyword logic if API fails
            }
        } 
        
        // Fallback Logic if no API key or API rate limits us
        const lowerText = text.toLowerCase();
        
        // Advanced Local NLP Fallback Simulator
        if (lowerText.includes('fire') || lowerText.includes('burn') || lowerText.includes('smoke')) {
            priority = "Emergency";
            department = "Fire Department";
            summary = "Emergency: Fire or smoke hazard reported.";
            autoResponse = "URGENT: Your report has been dispatched immediately to the Fire Department. Please evacuate the area safely.";
        } else if (lowerText.includes('water') || lowerText.includes('leak') || lowerText.includes('pipe')) {
            priority = "High";
            department = "Water Supply";
            summary = "Water leakage or supply interruption reported.";
            autoResponse = "Your complaint has been forwarded to the Water Supply Department. Our technicians will inspect the area soon.";
        } else if (lowerText.includes('electric') || lowerText.includes('power') || lowerText.includes('wire') || lowerText.includes('spark')) {
            priority = "High";
            department = "Electricity";
            summary = "Electricity/Power hazard reported.";
            autoResponse = "We have alerted the Electricity Board about the power issue. Please stay away from any exposed wires.";
        } else if (lowerText.includes('garbage') || lowerText.includes('waste') || lowerText.includes('trash') || lowerText.includes('smell')) {
            priority = "Medium";
            department = "Sanitation";
            summary = "Sanitation or garbage collection issue reported.";
            autoResponse = "The Sanitation Department has been notified to schedule a cleanup in your area.";
        } else if (lowerText.includes('road') || lowerText.includes('pothole') || lowerText.includes('street')) {
            priority = "Medium";
            department = "Public Works (Roads)";
            summary = "Road infrastructure damage reported.";
            autoResponse = "The Public Works department has been notified to survey and repair the road damage.";
        } else if (lowerText.includes('police') || lowerText.includes('crime') || lowerText.includes('theft') || lowerText.includes('fight')) {
            priority = "Emergency";
            department = "Police Department";
            summary = "Security or criminal incident reported.";
            autoResponse = "Law enforcement has been notified. If this is an active emergency, please dial the local emergency number immediately.";
        } else {
            // Dynamic text generation based on the user's input
            const words = text.split(' ').slice(0, 5).join(' ');
            priority = text.length > 100 ? "Medium" : "Normal";
            department = "General Administration";
            summary = `User submitted a general report concerning: "${words}..."`;
            autoResponse = "Thank you for bringing this to our attention. Our triage team will assign this to the correct department.";
        }

        res.json({
            priority,
            department,
            summary,
            autoResponse
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

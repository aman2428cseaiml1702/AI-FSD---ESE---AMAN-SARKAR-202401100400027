const jwt = require('jsonwebtoken');
require('dotenv').config();

async function test() {
  const fetch = globalThis.fetch;
  
  const text = 'Fire here at mall';
  const prompt = `Analyze this civic complaint: "${text}". 
  Respond ONLY with a valid JSON object containing exactly these keys:
  "priority" (High, Medium, or Normal), 
  "department" (Suggest the best municipal department like Water Supply, Electricity, Sanitation, Roads, etc),
  "summary" (A 1-sentence summary of the issue),
  "autoResponse" (A polite 1-2 sentence automated response to the user).`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'model': 'qwen/qwen3-coder:free',
            'messages': [
                {'role': 'system', 'content': 'You are a helpful smart city complaint analyzer API. Always return valid JSON.'},
                {'role': 'user', 'content': prompt}
            ],
            'response_format': { 'type': 'json_object' }
        })
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}
test();

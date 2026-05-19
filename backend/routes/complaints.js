const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');

// @route   POST api/complaints
// @desc    Add Complaint
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, location } = req.body;
        
        // Ensure required fields are present
        if(!title || !description) {
            return res.status(400).json({ msg: 'Please provide at least title and description' });
        }

        // Fetch user from DB to get actual name and email
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        const newComplaint = new Complaint({
            name: user ? user.name : "User", 
            email: user ? user.email : "email@example.com",
            title,
            description,
            category,
            location
        });

        const complaint = await newComplaint.save();
        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/complaints
// @desc    Get All Complaints
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let complaints;
        if (req.user.role === 'admin') {
            complaints = await Complaint.find().sort({ createdAt: -1 });
        } else {
            const User = require('../models/User');
            const user = await User.findById(req.user.id);
            complaints = await Complaint.find({ email: user ? user.email : '' }).sort({ createdAt: -1 });
        }
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/complaints/:id
// @desc    Update Complaint Status
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }

        const { status } = req.body;

        let complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });

        complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true }
        );

        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/complaints/search
// @desc    Search Complaint by Location
// @access  Private
router.get('/search', auth, async (req, res) => {
    try {
        const { location } = req.query;
        if(!location) {
            return res.status(400).json({ msg: 'Location query parameter is required' });
        }

        // Case-insensitive search using regex
        let query = { location: { $regex: location, $options: 'i' } };
        
        if (req.user.role !== 'admin') {
            const User = require('../models/User');
            const user = await User.findById(req.user.id);
            query.email = user ? user.email : '';
        }

        const complaints = await Complaint.find(query);
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

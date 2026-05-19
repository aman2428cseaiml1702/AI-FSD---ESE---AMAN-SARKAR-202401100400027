const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
 name: String,
 email: String,
 title: String,
 description: String,
 category: String,
 location: String,
 status: {
   type: String,
   default: "Pending"
 },
 createdAt: {
   type: Date,
   default: Date.now
 }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);

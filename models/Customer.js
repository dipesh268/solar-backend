
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  location: { type: String, required: true },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  utilityBill: {
     name: { type: String },
    size: { type: Number },
    type: { type: String },
    uploadDate: { type: Date },
    data: { type: Buffer },
    contentType: { type: String }
  },
  quizAnswers: {
    type: Map,
    of: String
  },
  scheduledDate: { type: Date },
  scheduledTime: { type: String },
  savingsReportDelivery: { type: String },
  schedulingNotes: { type: String },
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, default: 'New Lead' }
});

module.exports = mongoose.model('Customer', customerSchema);

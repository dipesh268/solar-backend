
const express = require('express');
const multer = require('multer');
const Customer = require('../models/Customer');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ submissionDate: -1 });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST new customer
router.post('/', upload.single('utilityBill'), async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file ? req.file.originalname : 'No file');

    let personalInfo = {};
    let location = '';

    // Parse personalInfo if it exists
    if (req.body.personalInfo) {
      try {
        personalInfo = typeof req.body.personalInfo === 'string' 
          ? JSON.parse(req.body.personalInfo) 
          : req.body.personalInfo;
      } catch (e) {
        console.error('Error parsing personalInfo:', e);
      }
    }

    // Parse location if it exists
    if (req.body.location) {
     
        location = req.body.location 
    }

    const customerData = {
      location,
      personalInfo,
      quizAnswers: req.body.quizAnswers || {},
      savingsReportDelivery: req.body.savingsReportDelivery || '',
      status: 'New Lead'
    };

    // Add utility bill data if file is uploaded
    if (req.file) {
      customerData.utilityBill = {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        uploadDate: new Date(),
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    // Add scheduling data if provided
    if (req.body.scheduledDate) {
      customerData.scheduledDate = new Date(req.body.scheduledDate);
    }
    if (req.body.scheduledTime) {
      customerData.scheduledTime = req.body.scheduledTime;
    }
    if (req.body.schedulingNotes) {
      customerData.schedulingNotes = req.body.schedulingNotes;
    }

    console.log('Creating customer with data:', {
      ...customerData,
      utilityBill: customerData.utilityBill ? { name: customerData.utilityBill.name, size: customerData.utilityBill.size } : null
    });

    const customer = new Customer(customerData);
    const savedCustomer = await customer.save();
    
    console.log('Customer saved successfully:', savedCustomer._id);
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET customer file
router.get('/:id/file', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer || !customer.utilityBill) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set({
      'Content-Type': customer.utilityBill.contentType,
      'Content-Disposition': `attachment; filename="${customer.utilityBill.name}"`
    });
    res.send(customer.utilityBill.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE customer with quiz answers and scheduling data
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating customer:', req.params.id, 'with data:', req.body);
    
    const updateData = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    console.log('Customer updated successfully:', customer._id);
    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');

const app = express();

// Apply middleware
app.use(express.json());
app.use(cors({
  origin: '*', // In production, you might want to restrict this
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Add middleware to handle /api prefix
app.use('/api', (req, res, next) => {
  // Remove /api from the path before processing
  req.url = req.url.replace(/^\/api/, '');
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 
      'mongodb://admin:password@mongodb.news-voyager.svc.cluster.local:27017/newsVoyager?authSource=admin';

    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10, // Connection pooling
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Implement retry logic
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  // Check MongoDB connection status
  if (mongoose.connection.readyState === 1) {
    res.status(200).send('OK');
  } else {
    res.status(500).send('MongoDB connection not ready');
  }
});

// Register endpoint
app.post('/register', (req, res) => {
  // To post / insert data into database
  const {email, password} = req.body;
  FormDataModel.findOne({email: email})
  .then(user => {
    if(user){ 
      res.json("Already registered")
    }
    else{
      FormDataModel.create(req.body)
      .then(log_reg_form => res.json(log_reg_form))
      .catch(err => res.json(err))
    }
  })
});

// Login endpoint
app.post('/login', (req, res) => {
  // To find record from the database
  const {email, password} = req.body;
  FormDataModel.findOne({email: email})
  .then(user => {
    if(user){
      // If user found then these 2 cases
      if(user.password === password) {
        res.json("Success");
      }
      else{
        res.json("Wrong password");
      }
    }
    // If user not found then 
    else{
      res.json("No records found! ");
    }
  })
});

// Update clicked news endpoint
app.post('/updateClickedNews', async (req, res) => {
  try {
    const { email, clickedNewsTitle } = req.body;

    // Find the user's document based on their email address
    const user = await FormDataModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the clicked news array in the user's document
    user.clickedNews.push(clickedNewsTitle);

    // Save the updated document back to the database
    await user.save();

    res.json({ message: 'Clicked news updated successfully' });
  } catch (error) {
    console.error('Error updating clicked news:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
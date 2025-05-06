
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3011; // Or any other port you prefer

// Enable CORS middleware
app.use(cors({
  origin: '*', // In production, you might want to restrict this
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/enterainment', (req, res, next) => {
  // Remove /business from the path before processing
  req.url = req.url.replace(/^\/enterainment/, '');
  next();
});

app.get('/', (req, res) => {
  res.send('Microservice API is running');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Define your API key and other constants
const apiKey = "d9fc5464da754543b7c0c02b01d89913";

// Define a route to handle requests for news data
app.get('/news/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const { page, pageSize, country } = req.query;

    // Make a request to the News API using axios
    const newsUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    const response = await axios.get(newsUrl);

    // Send the response data back to the client
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

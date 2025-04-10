const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require ('./models/FormData');


const app = express();
app.use(express.json());
app.use(cors());

const connectDB = async () => {
    try {
      const conn = await mongoose.connect('mongodb+srv://deepanshudr10:P7VtvA66JFeyTTyV@cluster0.upnjlj5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
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

app.post('/register', (req, res)=>{
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
    
})

app.post('/login', (req, res)=>{
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
})

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

app.listen(3001, () => {
    console.log("Server listining on http://localhost:3001");

});
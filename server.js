const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 

const port = 3019;
const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/students');

const db = mongoose.connection;

db.once('open', () => {
    console.log("MongoDB connection successful");
});

// Define the schema and model
const userSchema = new mongoose.Schema({
    regd_no: String,
    name: String,
    email: String,
    branch: String
});

const Users = mongoose.model('Users', userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/post', async (req, res) => {
    try {
        const { regd_no, name, email, branch } = req.body;

        const user = new Users({
            regd_no,
            name,
            email,
            branch,
        });

        await user.save();
        console.log(user);
        res.send("Form submission successful");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Error saving user");
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Feedback = require('./models/feedback');
const app = express();
const port = 3000;
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to database');
})
.catch(() => {
    console.log('Connection failed');
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
}); 

app.post('/submit-feedback', async(req, res) => {
    const feedback = new Feedback({
        name:req.body.name,
        contactNumber:req.body.contactNumber,
        email:req.body.email,
        feedback:req.body.feedback
    });
    await feedback.save()
    .then(() => {
        console.log('Feedback submitted successfully');
        res.send(
            `<html>
                <head>
                    <title>Feedback Submission</title>
                </head>
                <body>
                    <h1>Feedback submitted successfully</h1>
                    <a href="/">Go back to the form</a>
                </body>
            </html>`
        );
    })
    .catch(() => {
        console.log('Feedback submission failed');
        res.status(500).send('Feedback submission failed');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
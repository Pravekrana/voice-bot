const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDpGSztcDA6VJsulKMmaIErfnWyF1by2l8"; // Your API Key
const MODEL_NAME = "models/chat-bison-001"; // Use available model

app.post("/ask", async (req, res) => {
    const { message } = req.body;
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta1/${MODEL_NAME}:generateMessage?key=${API_KEY}`,
            {
                prompt: { messages: [{ content: message }] },
                temperature: 0.7
            }
        );

        const aiResponse = response.data?.candidates?.[0]?.content || "Sorry, I couldn't generate a response.";
        res.json({ response: aiResponse });

    } catch (error) {
        console.error("Error fetching AI response:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch AI response." });
    }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));

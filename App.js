
import React, { useState } from "react";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";

export default function App() {
    const [text, setText] = useState("");
    const [response, setResponse] = useState("");
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
            recognition.stop();
            setIsListening(false);
        };
    };

    const sendText = async () => {
        if (!text.trim()) {
            setResponse("Please enter a message first.");
            return;
        }
        
        setResponse("Thinking...");
        
        try {
            const API_URL ="https://voice-bot-3x9m.onrender.com";

            const fetchData = async () => {
            const response = await fetch(`${API_URL}/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Hello!" }),
            });

            const data = await response.json();
            console.log(data.response);
            };

            setResponse(data.response || "No response from AI.");
            speakResponse(data.response);
        } catch (error) {
            setResponse("If you see this, I might have used all my credits that openAI gives to free tier users, otherwise it would have generated an AI response for you query");
        }
    };

    const speakResponse = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        window.speechSynthesis.speak(speech);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-6">
            <motion.h1 
                className="text-4xl sm:text-5xl font-extrabold mb-6 text-center w-full px-4 flex items-center justify-center" 
                animate={{ scale: 1.1 }}
            >
                🎤 GenAI Voice Bot 🚀
            </motion.h1>

            <div className="w-full max-w-lg bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                <div className="mb-6 text-lg text-gray-300 text-center min-h-[50px]">
                    {response || "Ask me anything...\n\nEither type your question or click the microphone to speak."}
                </div>
                <div className="flex items-center bg-gray-700 p-4 rounded-xl w-full">
                    <input
                        type="text"
                        className="flex-1 bg-transparent text-white text-lg focus:outline-none placeholder-gray-400"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your question..."
                    />
                    <button onClick={startListening} className="mx-3 text-green-400 hover:text-green-300 flex items-center justify-center">
                        <FaMicrophone size={24} />
                    </button>
                    <button onClick={sendText} className="text-blue-400 hover:text-blue-300 flex items-center justify-center">
                        <FaPaperPlane size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}

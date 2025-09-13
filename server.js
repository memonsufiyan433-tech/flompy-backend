import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// Cohere API key (secure)
const COHERE_API_KEY = process.env.COHERE_API_KEY;

// Models mapping
const MODEL_MAP = {
  "flompy_ai": "command-r-plus",   // Cohere ka pehla model
  "flompy_ai_2": "command-r"       // Cohere ka doosra model
};

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message, uid, model } = req.body;
  try {
    const chosenModel = MODEL_MAP[model] || MODEL_MAP["flompy_ai"];
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: chosenModel,
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    res.json({ reply: data.text || data.reply || "No reply." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "⚠️ Backend error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Backend running on port " + PORT));

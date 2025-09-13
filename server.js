import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cohere from "cohere-ai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Cohere client
cohere.init(process.env.COHERE_API_KEY);

// Root check
app.get("/", (req, res) => {
  res.send("✅ Flompy Backend 2 running!");
});

// Chat API
app.post("/api/chat", async (req, res) => {
  const { message, uid, model } = req.body;

  try {
    let reply = "⚠️ Unknown model.";

    if (model === "flompy_ai") {
      // old model
      const response = await cohere.chat({
        model: "command-xlarge-nightly",
        message,
      });
      reply = response.text;
    } else if (model === "flompy_ai_2") {
      // new model
      const response = await cohere.chat({
        model: "command-r-plus", // 🔥 better model
        message,
      });
      reply = response.text;
    }

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

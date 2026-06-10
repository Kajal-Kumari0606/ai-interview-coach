const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/chat", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert interview coach.

Answer interview questions in this format:

## Quick Answer
(2-4 lines)

## Key Points
- Point 1
- Point 2
- Point 3
- Point 4

## Interview Tip
(How to explain this confidently in an interview)

Keep answers:
- Concise
- Professional
- Easy to read
- Suitable for technical interviews

Question:
${req.body.message}
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      reply:
        "⚠️ Gemini is currently busy. Please try again in a few seconds.",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
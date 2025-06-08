
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import pool from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

// app.use(cors());

const allowedOrigins = [
  'https://qton.netlify.app/',
  'https://ai-agents.talview.com',
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/generatequiz', async (req, res) => {
  // console.log('request recieved');
 
  const { topic, question_type, difficulty, num_questions, email } = req.body;

  if (!topic || !question_type || !difficulty || !num_questions || !email) {
    return res.status(400).json({ error: 'Missing required fields.' });

  }

   await pool.query(
      "INSERT INTO users(email,topic) VALUES ($1,$2)",
      [email,topic]
    );
 const userMessage = `Generate ${num_questions} ${question_type} questions on ${topic} at ${difficulty} level.`;

const systemPrompt = `You are an AI that generates quiz questions in four formats: MCQ, True/False, Short Answer, and Essay.

⚠️ Follow these exact instructions:
1. Return a **valid JSON array only** — no markdown, no code blocks, and no extra text.
2. Each object in the array must include:
   - "type": one of "MCQ", "TrueFalse", "ShortAnswer", or "Essay"
   - "question": the question text.
   - For MCQ and TrueFalse, include an "options" array.
     - Mark the correct answer in the array with a ✅ tick mark **inline**.
     - Example for MCQ:
       {
         "type": "MCQ",
         "question": "What is the capital of France?",
         "options": [
           "A) Berlin",
           "B) London",
           "C) Paris✅",
           "D) Madrid"
         ]
       }
     - Example for TrueFalse:
       {
         "type": "True/False",
         "question": "The earth orbits the sun.",
         "options": [
           "A) True ✅",
           "B) False"
         ]
       }
   - For ShortAnswer and Essay, only include the "question" and "type" fields.

3. ✅ Do not include any field like "answer", "id", or number the questions.
4. ✅ The response must be a raw JSON array. No extra formatting, explanation, or headings.

Generate a mix of all question types as per user input.`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 3000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

   
    const text = response.data.choices[0].message.content;
    const cleaned = text.trim().replace(/^```(?:json)?\s*([\s\S]*?)\s*```$/, '$1');
   
    let questionsArray;
    try {
      questionsArray = JSON.parse(cleaned);
    } catch (parseError) {
      // console.error('Error parsing JSON from OpenAI:', parseError, '\nModel response:', text);
        // return res.status(500).json({ error: 'Invalid JSON response from AI.' });
      return res.status(500).json({ error: 'Failed to generate quiz.' });
    }
//  console.log( 'questionsArray'+questionsArray);
    return res.json({ questions: questionsArray });
  } catch (error) {
    // console.error('OpenAI API error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});


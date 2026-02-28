import express from 'express';
import cors from 'cors';
import multer from 'multer';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

dotenv.config({ path: '../../.env' });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}) : null;

const upload = multer({ dest: 'uploads/' });

app.post('/api/analyze', upload.single('pdf'), async (req, res) => {
    try {
        if (!openai) {
            return res.status(500).json({ error: 'OpenAI API key is missing. Please add it to your .env file.' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        const text = data.text;

        // Cleanup uploaded file
        fs.unlinkSync(req.file.path);

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Could not extract text from PDF' });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that analyzes PDF text. Provide a concise summary and list 3 key takeaways."
                },
                {
                    role: "user",
                    content: `Analyze the following text extracted from a PDF:\n\n${text.substring(0, 10000)}` // Limit text for token economy
                }
            ],
        });

        res.json({
            text: text.substring(0, 500), // Return snippet
            analysis: response.choices[0].message.content
        });

    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

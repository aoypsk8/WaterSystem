import express from "express";
import { generateText, textToSpeech } from "../controllers/textToSpeech";

const router = express.Router();

router.post('/textToSpeech',textToSpeech); 
router.post('/generateText',generateText); 

export default router;



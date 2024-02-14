import { Request, Response, response } from "express";
import axios from "axios";
// @ts-ignore
import gtts from "gtts";

export async function textToSpeech(req: Request, res: Response) {
  try {
    const { text, language = "en", slow = false } = req.body;
    // Create the audio file
    const speech = new gtts(text, language, slow);
    const audioStream = speech.stream();
    // Set response headers
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=output.mp3");
    // Pipe audio stream to response
    audioStream.pipe(res);
  } catch (error) {
    res.json(error);
  }
}

export async function generateText(req: Request, res: Response) {
  try {
    const role = req.body.role;
    const content = req.body.content;
    const url = "https://chatgpt-free.p.rapidapi.com/chat";

    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "1e659dff5dmsh48ce7382a2b4f5dp1c546ajsn71e01dbba522",
      "X-RapidAPI-Host": "chatgpt-free.p.rapidapi.com",
    };

    const data = {
      past_conversations: [
        {
          role: role,
          content: content,
        },
      ],
    };

    axios
      .post(url, data, { headers })
      .then((response) => {
        return res.status(201).json({
          message: "Successfully",
          status: "ok",
          results: response.data.chatGPTResponse,
        });
      })
      .catch((error) => {
        return res.json({
          message: "Error",
          results: error,
        });
      });
  } catch (error) {
    res.json(error);
  }
}

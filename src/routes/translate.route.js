const express = require("express");
const axios = require("axios");
const translateRouter = express.Router();

// POST /api/translate
translateRouter.post("/", async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await axios.post(
      "https://libretranslate.de/translate",
      {
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.json({ translatedText: response.data.translatedText });
  } catch (error) {
    console.error("Translation Error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

module.exports = translateRouter;

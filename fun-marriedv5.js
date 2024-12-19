import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function translateToEnglish(text) {
  const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`);
  return translationResponse?.data?.[0]?.[0]?.[0];
}

export default {
  name: "ارسمي2",
  author: "HUSSEIN YACOUBI",
  role: "member",
  description: "🔮توليد صور على شكل انمي بإستخدام الذكاء الاصطناعي",
  aliases:["ani"],
  execute: async ({ api, event, args }) => {
    try {
      // Checking if the prompt is provided
      const prompt = args.join(" ");
      if (!prompt) {
        return api.sendMessage("⚠️ | قم بتقديم وصف بعد الأمر من احل توليد صور انمي بإستخدام الذكاء الإصطناعي", event.threadID);
      }

      // Set initial reaction to indicate processing
      api.setMessageReaction("⏰", event.messageID, () => {}, true);

      // Translate prompt to English if it's in Arabic
      const translatedPrompt = await translateToEnglish(prompt);

      // Measure time taken for generating the image
      const startTime = new Date().getTime();

      // API call to generate anime-style image
      const baseURL = `https://c-v5.onrender.com/api/ani`;
      const response = await axios.get(baseURL, {
        params: { prompt: translatedPrompt },
        responseType: 'stream'
      });

      const endTime = new Date().getTime();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

      // Edit the initial message with the progress bar
      const initialMessage = await api.sendMessage("⏳ جـارٍ تـولـيـد وصـفـك...", event.threadID);
      setTimeout(() => api.editMessage("████▒▒▒▒▒▒ 31%", initialMessage.messageID), 500);
      setTimeout(() => api.editMessage("██████▒▒▒▒ 59%", initialMessage.messageID), 1000);
      setTimeout(() => api.editMessage("███████▒▒▒ 73%", initialMessage.messageID), 1500);
      setTimeout(() => api.editMessage("█████████▒ 88%", initialMessage.messageID), 2000);
      setTimeout(() => api.editMessage("██████████ 100%", initialMessage.messageID), 2500);

      // Define file path and write stream for saving image
      const fileName = 'anime-x-image.png';
      const filePath = path.join(process.cwd(), 'cache', fileName);
      const writerStream = fs.createWriteStream(filePath);

      // Pipe response data to the file
      response.data.pipe(writerStream);

      writerStream.on('finish', async () => {
        // Unsend the progress message after completion
        api.unsendMessage(initialMessage.messageID);

        // Send final message with generated image
        await api.sendMessage({
          body: `✅ | تــم بــنــجــاح\n\n⚙️ | البــرومــبــت: ${prompt}\n⏱️ | الــوقــت: ${timeTaken} ث`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID);

        // Add reaction to original message
        api.setMessageReaction("✅", event.messageID, () => {}, true);
      });

    } catch (error) {
      console.error('Error generating image:', error);
      api.sendMessage("❌ |فــشــل الــتــولــيــد ربــمــا تــكــون الــمــشكــلــة مــن الــخــادم", event.threadID);
    }
  }
};
const allou_server = "https://allou.is-a-cool.dev/QSR";
const axios = require('axios');

module.exports = {
  config: {
    name: "ادامز",
    aliases: ["مغامرة"],
    version: "1.0",
    author: "Allou Mohamed & Dridi",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "game Adams.",
      ar: "مغامرة في منزل العائلة آدمز"
    },
    category: "الألعاب"
  },

  onStart: async function({ event, message, commandName }) {
    const uid = event.senderID;
    const res = await axios.get(allou_server, {
      params: {
        playerID: uid
      }
    });
    return message.reply(res.data.message, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        mid: info.messageID
      })
    });
  },
  onReply: async function({ message, event, args, Reply, commandName }) {
    const { mid, author } = Reply;
    const uid = event.senderID;
    if (uid != author) return message.reply('أنت لست لاعب القصة');
    const ans = {"1": "A", "2": "B", "3": "C"};
    const answer = ans[args[0]];
    const res = await axios.get(allou_server, {
      params: {
        playerID: uid,
        playerAnswer: answer
      }
    });
    
    message.unsend(mid);
    return message.reply(res.data.message, (err, info) => {
      if (res.data.end) return global.GoatBot.onReply.delete(mid);
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        mid: info.messageID
      })
    });
  }
  };
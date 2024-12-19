
module.exports.config = {
    name: "antiout",
    eventType: ["log:unsubscribe"],
    version: "1.0.7",
  credits: "S H A D O W",
    description: "Listen events",
    dependencies: {
        "path": ""
    }
};

module.exports.run = async function ({ api, event, Users }) {
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, '../commands', 'cache', 'meewmeew.json');
    const { antiout } = require(path);
    const { logMessageData, author, threadID } = event;
    const id = logMessageData.leftParticipantFbId;
    if (author == id && id != api.getCurrentUserID()) {
        const name = await Users.getNameUser(id) || "مستخدم فيسبوك";
        if (antiout.hasOwnProperty(threadID) && antiout[threadID] == true) {
            try {
                await api.addUserToGroup(id, threadID);
                return api.sendMessage(`تمت إضافة ${name} مرة أخرى إلى المجموعة .`);
            }
            catch (e) {
                return api.sendMessage(`لا يمكن إضافة ${name} .`, threadID);
            }
        }
    }
    return;
      }
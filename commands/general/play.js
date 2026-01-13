const axios = require("axios");

module.exports = {
  command: ["ytaudio"],
  run: async (client, m, args) => {
    const isCreator = global.owner.map((num) => num + "@s.whatsapp.net").includes(m.sender);
    const url = args[0];
    const ADONIX_API = "https://api-adonix.ultraplus.click/download/ytaudio";
    const ADONIX_KEY = "dvyer";

    try {
      if (!url) return; 

      const res = await axios.get(`${ADONIX_API}?url=${encodeURIComponent(url)}&apikey=${ADONIX_KEY}`);
      if (!res.data?.data?.url) throw new Error();

      await client.sendMessage(m.chat, {
        audio: { url: res.data.data.url },
        mimetype: "audio/mpeg",
        fileName: `musica.mp3`,
        caption: isCreator ? "Aquí tiene su música, mi señor @DenCaoos. 👑" : "Toma tu basura y lárgate. 🤖"
      }, { quoted: m });

    } catch (e) {
      m.reply(isCreator ? "Perdóneme mi señor, la API falló..." : "¡La API se murió por tu culpa, animal!");
    }
  }
};

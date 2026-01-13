const moment = require("moment");

module.exports = {
  command: ["ping"],
  description: "Mira si sigo vivo o si ya me morí de asco contigo",
  category: "general",
  run: async (client, m, args, { prefix }) => {
    const start = Date.now();
    
    // Mensaje de carga hostil
    const tempMsg = await client.sendMessage(
      m.key.remoteJid,
      { text: "¡¿Qué m*** quieres?! Espera a que mida mi velocidad..." },
      { quoted: m },
    );
    
    const latency = Date.now() - start;

    const up = process.uptime(),
      h = Math.floor(up / 3600),
      min = Math.floor((up % 3600) / 60),
      s = Math.floor(up % 60);
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const userTag = m.pushName || "Inútil";
    const sender = m.sender.replace(/@.+/, "");

    const msg = `Oye, pedazo de *${userTag}*...

¿Tanto te urge saber mi velocidad? Aquí tienes:

⚡ *LATENCIA:* ${latency} ms (Más rápido que tu cerebro)
🕒 *UPTIME:* [ ${h}h ${min}m ${s}s ] de puro caos
🧠 *RAM TRAGADA:* ${ram} MB
🆔 *TU ID DE BASURA:* @${sender}

_Si no respondo rápido es porque me das sueño._`.trim();

    await client.sendMessage(
      m.chat,
      { text: msg, mentions: [m.sender] },
      { quoted: tempMsg },
    );
  },
};


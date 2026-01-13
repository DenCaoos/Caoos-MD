const os = require("os");
const pkg = require("../../package.json");

module.exports = {
  command: ["info", "botinfo", "estado"],
  category: "general",
  run: async (client, m, args, from) => {
    const up = process.uptime(),
      h = Math.floor(up / 3600),
      min = Math.floor((up % 3600) / 60),
      s = Math.floor(up % 60);
    const cpu = os.cpus()[0]?.model.trim() || "Chatarra desconocida",
      cores = os.cpus().length;
    const mem = [
      (os.freemem() / 1024 / 1024).toFixed(0),
      (os.totalmem() / 1024 / 1024).toFixed(0),
    ];
    const platform = `${os.platform()} ${os.release()} (${os.arch()})`;
    const nodeV = process.version;
    const host = os.hostname();
    const shell = process.env.SHELL || process.env.COMSPEC || "basura de shell";
    const now = new Date().toLocaleString("en-US", {
      timeZone: "America/Mexico_City",
      hour12: false,
    });

    const info = `*「 ESTADO DEL SISTEMA - CAOOS-MD 」*

¿Qué m*** miras? Aquí tienes mis datos, no es que los vayas a entender con ese cerebro de mosquito.

*🤖 VERSIÓN:* ${pkg.version} (Hostile Edition)
*👑 DUEÑO:* DenCaoos (+34 634 19 26 46)
*⏳ TIEMPO ACTIVO:* ${h}h ${min}m ${s}s (Aguantando tus tonterías)

*🖥️ PLATAFORMA:* ${platform}
*🟢 NODE.JS:* ${nodeV}
*🏠 HOST:* ${host}
*🐚 SHELL:* ${shell}

*🧠 PROCESADOR:* ${cpu} (${cores} núcleos de puro poder)
*💾 MEMORIA:* ${mem[0]} MB Libres / ${mem[1]} MB Total

*📅 FECHA & HORA:* ${now}

_Deja de hurgar en mis entrañas y lárgate de aquí._`;

    await client.sendMessage(
      m.chat,
      {
        image: { url: "https://iili.io/FsijNdG.jpg" },
        caption: info,
      },
      { quoted: m },
    );
  },
};


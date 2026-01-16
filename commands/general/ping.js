/**
 * 💀 CAOOS MD - PING SÁDICO EVOLUTIVO
 * Efecto: Lectura lenta de insultos y carga rápida de sistema.
 **/

const moment = require("moment");

// Función de pausa para el drama
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  command: ["ping"],
  description: "Mide mi velocidad antes de que pierda la paciencia.",
  category: "general",
  run: async (client, m, args) => {
    const start = Date.now();
    
    // 1. Mensaje inicial - Lectura lenta
    const { key } = await client.sendMessage(m.chat, { text: "🔍 Escaneando qué tan basura eres..." }, { quoted: m });
    await delay(1500); // 1.5 segundos para que lo lea bien

    // 2. Segundo insulto - Lectura lenta
    await client.sendMessage(m.chat, { text: "⏳ Analizando por qué sigues molestando...", edit: key });
    await delay(1500);

    // 3. Barra de carga - Ejecución RÁPIDA
    const barras = [
      "⚠️ [▒▒▒▒▒▒▒▒▒▒] 0%",
      "⚠️ [██▒▒▒▒▒▒▒▒] 20%",
      "⚠️ [████▒▒▒▒▒▒] 40%",
      "⚠️ [██████▒▒▒▒] 60%",
      "⚠️ [████████▒▒] 80%",
      "⚠️ [██████████] 100%"
    ];

    for (let barra of barras) {
      await client.sendMessage(m.chat, { text: `🚀 *INYECTANDO CAOS:*\n\n${barra}`, edit: key });
      await delay(150); // Muy rápido para dar sensación de potencia
    }

    // 4. Cálculos finales
    const latency = Date.now() - start;
    const up = process.uptime(),
      h = Math.floor(up / 3600),
      min = Math.floor((up % 3600) / 60),
      s = Math.floor(up % 60);
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const userTag = m.pushName || "Inútil";
    const sender = m.sender.replace(/@.+/, "");

    const finalMsg = `Oye, pedazo de *${userTag}*...

¿Tanto te urge saber mi velocidad? Aquí tienes:

⚡ *LATENCIA:* ${latency} ms (Más rápido que tu cerebro)
🕒 *UPTIME:* [ ${h}h ${min}m ${s}s ] de puro caos
🧠 *RAM TRAGADA:* ${ram} MB
🆔 *ID:* @${sender}

_Si no respondo rápido es porque me das sueño._`.trim();

    // 5. Resultado final
    await client.sendMessage(m.chat, { 
      text: finalMsg, 
      edit: key, 
      mentions: [m.sender] 
    });
  },
};


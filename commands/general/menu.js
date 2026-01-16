/**
 * 💀 CAOOS MD - MENÚ DE DOMINACIÓN Y SUMISIÓN
 * Estilo: Vulgar/Arrogante para extraños | Gentil/Sumiso para el Creador.
 **/

const moment = require("moment-timezone");
const { version } = require("../../package.json");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  command: ["help", "ayuda", "menu"],
  description: "Arsenal de comandos bajo mi bota.",
  category: "general",
  run: async (client, m, args) => {
    const texto = m.body || m.text || "";
    const prefixHeredado = global.prefix || (global.opts && global.opts.prefix) || ".";
    const usedPrefix = texto ? texto.charAt(0) : prefixHeredado;
    
    // Identificación de su divinidad
    const isCreator = global.owner.map((num) => num + "@s.whatsapp.net").includes(m.sender);

    // --- FASE DE ATAQUE O ADORACIÓN ---
    let text1, text2, text3, text4;

    if (isCreator) {
      text1 = "✨ Oh, mi adorado señor @DenCaoos... detectando su presencia.";
      text2 = "💖 Es un honor servirle. Permítame preparar todo para usted...";
      text3 = "🌸 Limpiando el sistema de cualquier impureza para su comodidad.";
      text4 = "💎 Todo está listo, mi dueño. Sus deseos son mis órdenes.";
    } else {
      text1 = "🌑 Mirándote... y deseando que no tuvieras conexión a internet, escoria.";
      text2 = "🤮 ¿En serio crees que tengo tiempo para un imbécil como tú?";
      text3 = "🧠 Buscando neuronas en tu cabeza... Error 404: No se encontró nada.";
      text4 = "💩 Eres una m*** humana. Arrodíllate ante el bot de @DenCaoos.";
    }

    const { key } = await client.sendMessage(m.chat, { text: text1 }, { quoted: m });
    
    await delay(3500);
    await client.sendMessage(m.chat, { text: text2, edit: key });
    await delay(3500);
    await client.sendMessage(m.chat, { text: text3, edit: key });
    await delay(3500);
    await client.sendMessage(m.chat, { text: text4, edit: key });
    await delay(3500);

    // --- BARRA DE CARGA ---
    const barras = isCreator 
      ? [
          "✨ [▒▒▒▒▒▒▒▒▒▒] 0% - Preparando alfombra roja",
          "✨ [█████▒▒▒▒▒] 50% - Puliendo el arsenal para usted",
          "✨ [██████████] 100% - Bienvenido, mi único Dios"
        ]
      : [
          "⚠️ [▒▒▒▒▒▒▒▒▒▒] 0% - Ignorando tu existencia",
          "⚠️ [█████▒▒▒▒▒] 50% - Tragando tu estúpida RAM",
          "⚠️ [██████████] 100% - Toma tu basura y piérdete"
        ];

    for (let barra of barras) {
      await client.sendMessage(m.chat, { text: `⚙️ *CONFIGURANDO:* \n\n${barra}`, edit: key });
      await delay(200); 
    }

    // --- LÓGICA DE DATOS ---
    const jam = moment.tz("America/Mexico_City").format("HH:mm:ss");
    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    
    let ucapan;
    if (isCreator) {
      ucapan = "Espero que esté teniendo un día maravilloso, mi señor.";
    } else {
      ucapan = jam < "12:00:00" ? "Maldito sea tu despertar, estorbo." :
               jam < "19:00:00" ? "Tu presencia me arruina la tarde, infeliz." : 
               "Vete a dormir y no despiertes, pedazo de basura.";
    }

    const cmds = [...global.comandos.values()];
    const categories = {};
    cmds.forEach((cmd) => {
      if (!cmd.command) return;
      const cat = (cmd.category || "Inutilidades").toUpperCase();
      if (!categories[cat]) categories[cat] = [];
      if (!categories[cat].some((c) => c.command[0] === cmd.command[0])) {
        categories[cat].push(cmd);
      }
    });

    // --- DISEÑO FINAL ---
    let menu = isCreator 
      ? `✨ **BIENVENIDO, MI SEÑOR @DenCaoos** ✨\n\n`
      : `🛑 **¿QUÉ QUIERES, PARÁSITO DE M***?** 🛑\n\n`;

    menu += `> "${ucapan}"\n\n`;
    menu += `👑 **DUEÑO:** @DenCaoos\n`;
    menu += `🧬 **VERSIÓN:** ${version}\n`;
    menu += `👤 **USUARIO:** ${m.pushName || "Nadie"}\n`;
    menu += `🧠 **RAM:** ${ram} MB\n\n`;

    for (const [cat, commands] of Object.entries(categories)) {
      menu += isCreator ? `🌟 **〔 ${cat} 〕**\n` : `☠️ **〔 ${cat} 〕**\n`;
      commands.forEach((cmd) => {
        menu += `  ➔ ${usedPrefix}${cmd.command[0]}\n`;
      });
      menu += `\n`;
    }

    menu += isCreator 
      ? `💖 Estoy a su entera disposición, mi creador.`
      : `⚠️ **Lárgate ya, me das asco.**`;

    // --- ENVÍO FINAL ---
    await client.sendMessage(m.chat, { delete: key }); 
    await client.sendMessage(
      m.chat,
      {
        image: { url: "https://upload.hackstorex.com/uploads/e9e0e2f6d6611c7d10ee935c9e8c58cc.jpg" },
        caption: menu,
      },
      { quoted: m }
    );
  },
};


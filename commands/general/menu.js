const moment = require("moment-timezone");
const { pickRandom } = require("../../lib/message");
const { version } = require("../../package.json");

module.exports = {
  command: ["help", "ayuda", "menu"],
  description: "Muestra la m*** de comandos que tengo",
  category: "general",
  run: async (client, m, args) => {
    const cmds = [...global.comandos.values()];

    const jam = moment.tz("America/Mexico_City").format("HH:mm:ss");
    
    // Saludos agresivos según la hora
    const ucapan =
      jam < "05:00:00"
        ? "¡¿Qué haces despierto a estas horas, animal?!"
        : jam < "11:00:00"
          ? "Buenos días por decir algo, porque me das asco."
          : jam < "15:00:00"
            ? "Buenas tardes, muévete de una vez."
            : jam < "19:00:00"
              ? "Buenas tardes... ¿otra vez tú molestando?"
              : "Buenas noches, a ver si ya te duermes y dejas de j***.";

    const fkontak = {
      key: {
        participant: `0@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: `status@broadcast` } : {}),
      },
      message: {
        contactMessage: {
          displayName: `PROPIEDAD DE DENCAOOS`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;DenCaoos;;;\nFN:DenCaoos\nitem1.TEL;waid=34634192646:34634192646\nitem1.X-ABLabel:EL JEFE\nEND:VCARD`,
          sendEphemeral: true,
        },
      },
    };

    const categories = {};
    cmds.forEach((cmd) => {
      if (!cmd.command) return;
      const cat = (cmd.category || "Basura variada").toLowerCase();
      if (!categories[cat]) categories[cat] = [];
      if (!categories[cat].some((c) => c.command[0] === cmd.command[0])) {
        categories[cat].push(cmd);
      }
    });

    let menu = `╭───❮ *CAOOS-MD: EL INFIERNO* ❯───╮
│
│  ${ucapan}
│  Oye, *${m.pushName || "Inútil"}*, lee bien:
│
│  *ESTADO DEL SISTEMA*
│  Creador  : DenCaoos (+34 634 19 26 46)
│  Versión  : ${version} (Hostile)
│  Usuario  : ${m.pushName || "Basura sin nombre"}
│
`;

    for (const [cat, commands] of Object.entries(categories)) {
      const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
      menu += `│─── *[ SECCIÓN: ${catName} ]*\n`;
      commands.forEach((cmd) => {
        menu += `│  ➤ .${cmd.command[0]}\n`;
      });
      menu += `│\n`;
    }

    menu += `│  _Si no sabes usar un comando,_
│  _mejor lárgate a dormir._
╰─────────────────────╯`;

    await client.sendMessage(
      m.chat,
      {
        image: { url: "https://i.ibb.co/P0VXh06/5faea421e58b.jpg" },
        caption: menu,
      },
      { quoted: fkontak },
    );
  },
};


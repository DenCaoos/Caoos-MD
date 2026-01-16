require("./settings");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const chalk = require("chalk");
const gradient = require("gradient-string");
const seeCommands = require("./lib/system/commandLoader");
const initDB = require("./lib/system/initDB");
const antilink = require("./commands/antilink");
const { resolveLidToRealJid } = require("./lib/utils");

seeCommands();

module.exports = async (client, m) => {
  let body = "";

  if (m.message) {
    if (m.message.conversation) body = m.message.conversation;
    else if (m.message.extendedTextMessage?.text)
      body = m.message.extendedTextMessage.text;
    else if (m.message.imageMessage?.caption)
      body = m.message.imageMessage.caption;
    else if (m.message.videoMessage?.caption)
      body = m.message.videoMessage.caption;
    else if (m.message.buttonsResponseMessage?.selectedButtonId)
      body = m.message.buttonsResponseMessage.selectedButtonId;
    else if (m.message.listResponseMessage?.singleSelectReply?.selectedRowId)
      body = m.message.listResponseMessage.singleSelectReply.selectedRowId;
    else if (m.message.templateButtonReplyMessage?.selectedId)
      body = m.message.templateButtonReplyMessage.selectedId;
  }

  initDB(m);
  antilink(client, m);

  const prefa = ['.', '!', '#', '/'];
  const prefix = prefa.find((p) => body.startsWith(p));
  if (!prefix) return;

  const from = m.key.remoteJid;
  const args = body.trim().split(/ +/).slice(1);
  const text = args.join(" ");
  const botJid = client.user.id.split(":")[0] + "@s.whatsapp.net";

  const command = body
    .slice(prefix.length)
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();
  
  const pushname = m.pushName || "Inútil sin nombre";

  // --- IDENTIFICACIÓN DE PODER ABSOLUTO ---
  const senderNumber = m.sender.split('@')[0].replace(/[^0-9]/g, '');
  const isCreator = "34634192646" === senderNumber || m.fromMe; 
  const isRegistered = global.db.data.users[m.sender]?.registered;

  // --- FILTRO DE ACCESO AGRESIVO ---
  if (!isCreator) {
    if (!isRegistered && command !== 'reg' && command !== 'registrar') {
      const mensajesBloqueo = [
        `🤮 **¡ALTO AHÍ, ESCORIA!**\n\nNo tienes permiso para usar el comando *${prefix}${command}*. Eres un don nadie. Usa *.reg* para registrarte o lárgate.`,
        `🤨 ¿Te crees con derecho a usar *${prefix}${command}* sin estar fichado?\n\nPrimero usa *.reg* para que @DenCaoos sepa qué clase de basura eres.`,
        `💩 **ERROR DE JERARQUÍA.**\n\nRegístrate usando el comando *.reg* si quieres que te responda, infeliz.`
      ];
      return m.reply(mensajesBloqueo[Math.floor(Math.random() * mensajesBloqueo.length)]);
    }
  } else {
    console.log(chalk.yellowBright(`👑 ORDEN DEL SOBERANO @DenCaoos: ${prefix}${command}`));
  }

  // --- LÓGICA DE GRUPOS ---
  let groupMetadata, groupName = "", resolvedAdmins = [];
  if (m.isGroup) {
    groupMetadata = await client.groupMetadata(m.chat).catch((_) => null);
    groupName = groupMetadata?.subject || "";
    const groupAdmins = groupMetadata?.participants.filter(p => p.admin) || [];
    resolvedAdmins = await Promise.all(
      groupAdmins.map((adm) =>
        resolveLidToRealJid(adm.jid, client, m.chat).then((realJid) => ({ ...adm, jid: realJid }))
      )
    );
  }

  const isBotAdmins = m.isGroup ? resolvedAdmins.some((p) => p.jid === botJid) : false;
  const isAdmins = m.isGroup ? resolvedAdmins.some((p) => p.jid === m.sender) : false;

  // LOGS DE CONSOLA
  console.log(chalk.bold.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.bold.red(`┃ MOLESTANDO: ${chalk.whiteBright(pushname.toUpperCase())}`));
  console.log(chalk.bold.red(`┃ COMANDO: ${chalk.yellowBright(command)}`));
  console.log(chalk.bold.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  if (global.comandos.has(command)) {
    const cmdData = global.comandos.get(command);
    if (!cmdData) return;

    // Estadísticas
    global.db.data.stats = global.db.data.stats || {};
    global.db.data.users[m.sender].count = (global.db.data.users[m.sender].count || 0) + 1;
    global.db.data.stats[command] = (global.db.data.stats[command] || 0) + 1;

    // VALIDACIONES (Usted se salta la de Owner porque ya es Creator)
    if (cmdData.isOwner && !isCreator) return m.reply(global.mess.owner);
    if (cmdData.isGroup && !m.isGroup) return m.reply(global.mess.group);
    if (cmdData.isAdmin && !isAdmins) return m.reply(global.mess.admin);
    if (cmdData.isBotAdmin && !isBotAdmins) return m.reply(global.mess.botAdmin);

    try {
      await cmdData.run(client, m, args, { text });
    } catch (error) {
      await client.sendMessage(m.chat, { text: `¡Error! Rompiste algo: ${error.message}` }, { quoted: m });
    }
  }
};

const mainFile = require.resolve(__filename);
fs.watchFile(mainFile, () => {
  fs.unwatchFile(mainFile);
  delete require.cache[mainFile];
  require(mainFile);
});


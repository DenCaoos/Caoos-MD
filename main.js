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

  const prefa = ['.', '!', '#', '/']
  const prefix = prefa.find((p) => body.startsWith(p))
  if (!prefix) return

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
  const sender = m.isGroup
    ? m.key.participant || m.participant
    : m.key.remoteJid;

  let groupMetadata,
    groupAdmins,
    resolvedAdmins = [],
    groupName = "";
  if (m.isGroup) {
    groupMetadata = await client.groupMetadata(m.chat).catch((_) => null);
    groupName = groupMetadata?.subject || "";
    groupAdmins =
      groupMetadata?.participants.filter(
        (p) => p.admin === "admin" || p.admin === "superadmin",
      ) || [];
    resolvedAdmins = await Promise.all(
      groupAdmins.map((adm) =>
        resolveLidToRealJid(adm.jid, client, m.chat).then((realJid) => ({
          ...adm,
          jid: realJid,
        })),
      ),
    );
  }

  const isBotAdmins = m.isGroup
    ? resolvedAdmins.some((p) => p.jid === botJid)
    : false;
  const isAdmins = m.isGroup
    ? resolvedAdmins.some((p) => p.jid === m.sender)
    : false;

  // LOGS DE CONSOLA AGRESIVOS
  const h = chalk.bold.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const v = chalk.bold.red("┃");
  const date = chalk.bold.red(
    `\n${v} HORA DEL CAOS: ${chalk.whiteBright(moment().format("HH:mm:ss"))}`,
  );
  const userPrint = chalk.bold.red(
    `\n${v} MOLESTANDO: ${chalk.whiteBright(pushname.toUpperCase())}`,
  );
  const cmdPrint = chalk.bold.red(
    `\n${v} COMANDO USADO: ${chalk.yellowBright(command)}`,
  );
  const groupPrint = m.isGroup
    ? chalk.bold.red(
        `\n${v} GRUPO: ${chalk.greenBright(groupName)}\n`,
      )
    : chalk.bold.red(`\n${v} TIPO: Chat Privado\n`);
  
  console.log(`${h}${date}${userPrint}${cmdPrint}${groupPrint}${h}`);

  if (global.comandos.has(command)) {
    const cmdData = global.comandos.get(command);
    if (!cmdData) return;

    // VALIDACIONES CON MENSAJES DE ERROR (Definidos en settings.js)
    if (
      cmdData.isOwner &&
      !global.owner.map((num) => num + "@s.whatsapp.net").includes(m.sender)
    )
      return m.reply(global.mess.owner);
    if (cmdData.isReg && !db.data.users[m.sender]?.registered)
      return m.reply("¡Regístrate primero, estúpido! No atiendo a desconocidos.");
    if (cmdData.isGroup && !m.isGroup) return m.reply(global.mess.group);
    if (cmdData.isAdmin && !isAdmins) return m.reply(global.mess.admin);
    if (cmdData.isBotAdmin && !isBotAdmins) return m.reply(global.mess.botAdmin);
    if (cmdData.isPrivate && m.isGroup) return m.reply(global.mess.private);

    try {
      await cmdData.run(client, m, args, { text });
    } catch (error) {
      console.error(chalk.red(`[!] ERROR CRÍTICO POR CULPA DEL USUARIO:`), error);
      await client.sendMessage(
        m.chat,
        { text: `¡Felicidades, animal! Rompiste el bot con tu estupidez. Error: ${error.message}` },
        { quoted: m },
      );
    }
  } else {
    // Respuesta si el comando no existe (Opcional, activa si quieres que insulte siempre)
    // return m.reply("¡Ese comando no existe, pedazo de analfabeto! Escribe bien.");
  }
};

const mainFile = require.resolve(__filename);
fs.watchFile(mainFile, () => {
  fs.unwatchFile(mainFile);
  console.log(
    chalk.red.bold(
      `\n[!] CAOOS-MD: Recargando el archivo principal porque DenCaoos hizo cambios...`,
    ),
  );
  delete require.cache[mainFile];
  require(mainFile);
});

// CAOOS-MD © 2026 - Creado por DenCaoos | EL BOT MÁS AGRESIVO

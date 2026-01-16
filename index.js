/**
 * ========================================================
 * CAOOS-MD - PROPIEDAD EXCLUSIVA DE @DENCAOOS
 * ========================================================
 * Creador: DenCaoos (@DenCaoos)
 * Año: 2026 | Si robas esto, eres una basura sin vida.
 * ========================================================
 **/

require("./settings");
require("./lib/database");
const {
  default: makeWASocket,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  jidDecode,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const os = require("os");
const qrcode = require("qrcode-terminal");
const parsePhoneNumber = require("awesome-phonenumber");
const { smsg } = require("./lib/message");
const { app, server } = require("./lib/server");
const { Boom } = require("@hapi/boom");
const { exec } = require("child_process");

// ESTÉTICA AGRESIVA DE CONSOLA
const print = (label, value) =>
  console.log(
    `${chalk.red.bold("┃")} ${chalk.white.bold(label.padEnd(16))}${chalk.red.bold("»")} ${chalk.gray(value)}`,
  );

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
};
const usePairingCode = true;

const log = {
  info: (msg) => console.log(chalk.bgCyan.black.bold(` CAOOS-MD `), chalk.cyan(msg)),
  success: (msg) =>
    console.log(chalk.bgGreen.black.bold(` LISTO `), chalk.greenBright(msg)),
  warn: (msg) =>
    console.log(
      chalk.bgYellow.black.bold(` ¿ERES IDIOTA? `),
      chalk.yellow(msg),
    ),
  warning: (msg) =>
    console.log(chalk.bgRed.white.bold(` ¡CUIDADO! `), chalk.red(msg)),
  error: (msg) =>
    console.log(chalk.bgRed.white.bold(` ¡BASURA! `), chalk.redBright(msg)),
};

const userInfoSyt = () => {
  try {
    return os.userInfo().username;
  } catch (e) {
    return "desconocido";
  }
};

console.clear();
console.log(
  chalk.red.bold(
    `╔═════[ ${chalk.white(`PROPIEDAD DE @DENCAOOS`)} ]═════╗`,
  ),
);
print("SISTEMA", `${os.platform()} ${os.release()} ${os.arch()}`);
print("ACTIVIDAD", `${Math.floor(os.uptime() / 3600)} h de puro poder`);
print("VERSIÓN", `v${require("./package.json").version}`);
print("NODE.JS", process.version);
print("BAILEYS", `WhiskeySockets/baileys`);
print(
  "TIEMPO REAL",
  new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
    hour12: false,
  }),
);
console.log(chalk.red.bold("╚" + "═".repeat(40)));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName);
  const { version } = await fetchLatestBaileysVersion();

  console.info = () => {};
  console.debug = () => {};
  const client = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["Caoos-MD", "Chrome", "1.0.0"],
    auth: state,
  });

  // VINCULACIÓN: LÓGICA INTACTA, TEXTOS AGRESIVOS
  if (!client.authState.creds.registered) {
    const phoneNumber = await question(
      log.warn("¡ESCRIBE TU MALDITO NÚMERO YA!\n") +
        log.info("Ejemplo para cortos de mente: 5212345678900\n") + chalk.red(" > ")
    );
    try {
      log.info("Solicitando código... Espérate, animal.");
      const pairing = await client.requestPairingCode(phoneNumber, "1234MINI");
      
      // CÓDIGO EN ROJO SANGRE COMO USTED PIDÓ
      console.log(chalk.red.bold("\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"));
      console.log(chalk.red.bold("┃") + chalk.white.bold(" CÓDIGO DE ACCESO: ") + chalk.bgBlack.redBright.bold(`  ${pairing}  `) + chalk.red.bold(" ┃"));
      console.log(chalk.red.bold("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n"));
      
      log.success("Ahí tienes tu código. Úsalo rápido antes de que expire, basura.");
    } catch (err) {
      log.error("Hiciste algo mal, pedazo de estúpido. Borrando basura...");
      exec("rm -rf ./lurus_session/*");
      process.exit(1);
    }
  }

  await global.loadDatabase();
  log.success("Base de datos inyectada correctamente. Ya puedes molestar gente.");

  client.sendText = (jid, text, quoted = "", options) =>
    client.sendMessage(jid, { text, ...options }, { quoted });

  client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      log.warning(`Se cerró esta m*** de conexión (Razón: ${reason}). Reconectando...`);
      startBot();
    }
    if (connection === "open") {
      log.success("¡CAOOS-MD ESTÁ VIVO! Tiemblen, gusanos.");
    }
  });

  client.ev.on("messages.upsert", async ({ messages }) => {
    try {
      let m = messages[0];
      if (!m.message) return;
      m.message =
        Object.keys(m.message)[0] === "ephemeralMessage"
          ? m.message.ephemeralMessage.message
          : m.message;
      if (m.key && m.key.remoteJid === "status@broadcast") return;
      m = smsg(client, m);
      require("./main")(client, m, messages);
    } catch (err) {
      log.error("Fallo al procesar un mensaje estúpido.");
    }
  });

  client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return decode.user && decode.server
        ? decode.user + "@" + decode.server
        : jid;
    }
    return jid;
  };

  client.ev.on("creds.update", saveCreds);
}

startBot();
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.red.bold(`\n[!] @DenCaoos actualizó mi núcleo. Reiniciando por mi dueño...\n`));
  delete require.cache[file];
  require(file);
});


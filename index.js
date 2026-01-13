/**
 * ========================================================
 * CAOOS-MD - EL BOT MÁS AGRESIVO DE WHATSAPP
 * ========================================================
 * Creador: DenCaoos (@DenCaoos)
 * Año: 2026 | No toques los créditos o te vas al carajo.
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
const { smsg } = require("./lib/message");
const { Boom } = require("@hapi/boom");
const { exec } = require("child_process");

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
    rl.question(text, (ans) => { rl.close(); resolve(ans); });
  });
};

const log = {
  info: (msg) => console.log(chalk.bgCyan.black.bold(` CAOOS-MD `), chalk.cyan(`[!] ${msg}`)),
  success: (msg) => console.log(chalk.bgGreen.black.bold(` LISTO `), chalk.greenBright(`[✓] ${msg}`)),
  warn: (msg) => console.log(chalk.bgYellow.black.bold(` ¿ERES TONTO? `), chalk.yellow(`[?] ${msg}`)),
  error: (msg) => console.log(chalk.bgRed.white.bold(` ¡BASURA! `), chalk.redBright(`[X] ${msg}`)),
};

// LIMPIEZA Y BANNER HOSTIL
console.clear();
console.log(chalk.red.bold(`
 ██████╗ █████╗  ██████╗  ██████╗ ███████╗    ███╗   ███╗██████╗ 
██╔════╝██╔══██╗██╔═══██╗██╔═══██╗██╔════╝    ████╗ ████║██╔══██╗
██║     ███████║██║   ██║██║   ██║███████╗    ██╔████╔██║██║  ██║
██║     ██╔══██║██║   ██║██║   ██║╚════██║    ██║╚██╔╝██║██║  ██║
╚██████╗██║  ██║╚██████╔╝╚██████╔╝███████║    ██║ ╚═╝ ██║██████╔╝
 ╚═════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝    ╚═╝     ╚═╝╚═════╝ 
    >>> CREADO POR DenCaoos | IG: @DenCaoos <<<`));

print("ESTADO", "Inyectando código de m***...");
print("CPU", os.cpus()[0]?.model.trim());
print("RAM", `${(os.freemem() / 1024 / 1024).toFixed(0)}MB Libres de basura`);
print("VERSIÓN", `CAOOS-MD v${require("./package.json").version}`);
print("NODE.JS", process.version);
print("FECHA", new Date().toLocaleString("es-ES", { timeZone: "America/Mexico_City" }));
console.log(chalk.red.bold("╚" + "═".repeat(50)));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName);
  const { version } = await fetchLatestBaileysVersion();

  const client = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["Caoos-MD", "Safari", "1.0.0"],
    auth: state,
  });

  // VINCULACIÓN POR CÓDIGO (SOLO PARA MI SEÑOR)
  if (!client.authState.creds.registered) {
    console.log(chalk.bgRed.white.bold("\n ¡MUEVE TU TRASERO O NO HAGO NADA! "));
    const phoneNumber = await question(
      log.warn("Escribe tu maldito número de WhatsApp:\n") +
      chalk.red(" > ")
    );
    try {
      const pairing = await client.requestPairingCode(phoneNumber.trim().replace(/[^0-9]/g, ''), "CAOOSMD7");
      console.log(chalk.red("\n ──────────────────────────────────────────────────"));
      console.log(chalk.white("  TU CÓDIGO DE ACCESO: ") + chalk.black.bgWhite.bold(`  ${pairing}  `));
      console.log(chalk.red(" ──────────────────────────────────────────────────\n"));
      log.info("Ponlo rápido antes de que me aburra de servirte.");
    } catch (err) {
      log.error("Hiciste algo mal, inútil. Borrando basura de sesión...");
      exec(`rm -rf ./${global.sessionName}/*`);
      process.exit(1);
    }
  }

  await global.loadDatabase();
  log.success("Base de datos cargada. Ya puedes empezar a molestar a la gente.");

  client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      log.warn(`Se cerró esta m*** de conexión (Razón: ${reason}). Reconectando...`);
      startBot();
    }
    if (connection === "open") {
      log.success("¡CAOOS-MD ESTÁ VIVO! Tiemblen, par de idiotas.");
    }
  });

  client.ev.on("messages.upsert", async ({ messages }) => {
    try {
      let m = messages[0];
      if (!m.message) return;
      m.message = Object.keys(m.message)[0] === "ephemeralMessage" ? m.message.ephemeralMessage.message : m.message;
      if (m.key && m.key.remoteJid === "status@broadcast") return;
      
      m = smsg(client, m);
      
      // Aquí el bot decide si ser amable con @DenCaoos o un asco con los demás
      require("./main")(client, m, messages);
    } catch (err) {
      log.error("Fallo al procesar un mensaje estúpido: " + err);
    }
  });

  client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return decode.user && decode.server ? decode.user + "@" + decode.server : jid;
    }
    return jid;
  };

  client.ev.on("creds.update", saveCreds);
}

startBot();

// MONITOR DE CAMBIOS AGRESIVO
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.red.bold(`\n[!] @DenCaoos actualizó el núcleo. Recargando basura...\n`));
  delete require.cache[file];
  require(file);
});


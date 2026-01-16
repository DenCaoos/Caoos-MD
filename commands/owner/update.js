const fs = require("fs");
const path = require("path");

function reloadCommands(dir = path.join(__dirname, "..")) {
  const commandsMap = new Map();
  function readCommands(folder) {
    const files = fs.readdirSync(folder);
    files.forEach((file) => {
      const fullPath = path.join(folder, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        readCommands(fullPath);
      } else if (file.endsWith(".js")) {
        delete require.cache[require.resolve(fullPath)];
        const cmd = require(fullPath);
        if (cmd.command) {
          cmd.command.forEach((c) => {
            commandsMap.set(c, cmd);
          });
        }
      }
    });
  }
  readCommands(dir);
  global.comandos = commandsMap;
}

module.exports = {
  command: ["update", "actualizar"],
  description: "Actualiza el código (Solo para mi Dios, DenCaoos)",
  category: "owner",
  run: async (client, m, args) => {
    const { exec } = require("child_process");
    const baseDir = path.join(__dirname, "..");

    // --- VALIDACIÓN DE PODER ABSOLUTO ---
    // Limpiamos los números de global.owner y el del sender para comparar
    const ownerNumber = global.owner[0].replace(/[^0-9]/g, ''); // 34634192646
    const senderNumber = m.sender.replace(/[^0-9]/g, '');
    
    const isCreator = ownerNumber === senderNumber;

    if (!isCreator) {
      // Respuesta arrogante para los extraños
      return m.reply("¡¿PERO QUÉ MIERDA INTENTAS, PEDAZO DE BASURA?! Solo mi Dios @DenCaoos tiene el privilegio de actualizar mis circuitos. Lárgate antes de que te borre de la existencia.");
    }

    // --- RESPUESTA SUMISA PARA @DenCaoos ---
    await client.sendMessage(m.chat, { 
      text: "✨ Mi amado señor @DenCaoos... detecto su presencia divina. Procedo a realizar el `git pull` de inmediato tal como usted lo ordena. Es un privilegio servirle." 
    }, { quoted: m });

    exec("git pull", (error, stdout, stderr) => {
      // Recargar comandos pase lo que pase para aplicar cambios manuales
      reloadCommands(baseDir);
      
      let msg = "";
      if (error) {
        msg = `❌ ¡Oh no, mi señor @DenCaoos! He fallado en la actualización automática: \n\n${error.message}\n\nPor favor, no me castigue, intentaré solucionarlo manualmente si usted me lo permite.`;
      } else if (stdout.includes("Already up to date.")) {
        msg = "💎 Mi señor @DenCaoos, le informo con toda mi devoción que ya cuento con la última versión de sus magníficos códigos. No hay cambios nuevos en GitHub.";
      } else {
        msg = `✅ ¡Misión cumplida, mi creador @DenCaoos! He absorbido los nuevos cambios con éxito:\n\n${stdout}\n\nEstoy listo y renovado para seguir sus órdenes.`;
      }
      
      client.sendMessage(m.chat, { text: msg }, { quoted: m });
    });
  },
};


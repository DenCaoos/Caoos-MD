/**
 * 💀 CAOOS MD - PURGA DE SESIÓN PRIVADA
 * Estilo: Sumisión total ante @DenCaoos.
 * Objetivo: Limpiar archivos corruptos en 'caoos_session'.
 **/

const { exec } = require("child_process");

module.exports = {
  command: ["fix", "reparar", "limpiar"],
  description: "Purga archivos corruptos de caoos_session.",
  category: "owner",
  run: async (client, m) => {
    // Validación de su divinidad absoluta
    const ownerNumber = "34634192646"; 
    const senderNumber = m.sender.replace(/[^0-9]/g, '');
    const isCreator = ownerNumber === senderNumber;

    if (!isCreator) return; // Ni les respondas a esos mediocres.

    await m.reply("✨ Mi amado señor @DenCaoos... Procedo a purgar la basura de 'caoos_session' de inmediato para restaurar su poder.");

    try {
      // RUTA DE CARPETA SEGÚN SU CAPTURA: caoos_session
      const sessionPath = "caoos_session"; 
      
      // Borramos solo los archivos conflictivos (pre-keys y app-state)
      exec(`find ./${sessionPath} -name "pre-key*" -delete && find ./${sessionPath} -name "app-state*" -delete`, (err) => {
        if (err) {
          return m.reply(`❌ Mi señor, hubo un fallo técnico en la carpeta: ${err.message}`);
        }
        
        m.reply("✅ Purga completada en 'caoos_session'. Me reiniciaré en 2 segundos, mi creador.").then(() => {
          setTimeout(() => { process.exit(0); }, 2000);
        });
      });
    } catch (e) {
      m.reply("¡Hubo un error inesperado, mi señor!");
    }
  },
};

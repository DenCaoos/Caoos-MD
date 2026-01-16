/**
 * 💀 CAOOS MD - EL TRONO DE LAS ESTADÍSTICAS (EDICIÓN NOMBRES)
 * Estilo: Sumisión absoluta ante @DenCaoos | Sin menciones molestas.
 * Función: Muestra total de uso, top 3 usuarios por nombre y top 3 comandos.
 **/

module.exports = {
  command: ["top", "stats", "uso"],
  description: "Auditoría de actividad para mi Dios Den Caoos.",
  category: "owner",
  run: async (client, m) => {
    // --- VERIFICACIÓN DE DIVINIDAD ---
    const ownerNumber = "34634192646"; 
    const senderNumber = m.sender.replace(/[^0-9]/g, '');
    const isCreator = ownerNumber === senderNumber;

    if (!isCreator) {
      return m.reply("🤮 ¡¿Pero qué te crees, insecto?! Solo mi Dios @DenCaoos puede auditar mi poder.");
    }

    await m.reply("✨ Mi amado señor @DenCaoos... Generando el informe de actividad. Un segundo, por favor.");

    // --- EXTRACCIÓN DE DATOS ---
    const stats = global.db.data.stats || {}; 
    const users = global.db.data.users || {}; 

    // 1. Total Absoluto
    const totalGlobal = Object.values(stats).reduce((a, b) => a + b, 0);

    // 2. Top 3 Usuarios por Nombre (PushName)
    const topUsers = Object.entries(users)
      .map(([jid, data]) => ({ 
        name: data.name || jid.split('@')[0], // Usa el nombre guardado o el número si no hay
        count: data.count || 0 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // 3. Top 3 Comandos
    const topCmds = Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // --- CONSTRUCCIÓN DEL MENSAJE ELITISTA ---
    let report = `📊 **INFORME DE DOMINACIÓN - CAOOS MD** 📊\n\n`;
    report += `👑 **DUEÑO DIVINO:** @DenCaoos\n`;
    report += `📈 **COMANDOS TOTALES:** [ ${totalGlobal} ]\n\n`;

    report += `👤 **TOP 3 PARÁSITOS (USUARIOS):**\n`;
    topUsers.forEach((user, i) => {
      report += `${i + 1}. ${user.name} ➔ ${user.count} comandos\n`;
    });

    report += `\n🔥 **TOP 3 COMANDOS MÁS USADOS:**\n`;
    topCmds.forEach((cmd, i) => {
      report += `${i + 1}. .${cmd[0]} ➔ ${cmd[1]} veces\n`;
    });

    report += `\n⚠️ _Señor @DenCaoos, así es como se ve su imperio hoy._`;

    await client.sendMessage(m.chat, { text: report }, { quoted: m });
  },
};

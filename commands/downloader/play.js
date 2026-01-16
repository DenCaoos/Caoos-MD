const yts = require("yt-search");

module.exports = {
  command: ["play"],
  categoria: "descarga",
  description: "Busca contenido para mi Dios @DenCaoos o para la basura del grupo",
  run: async (client, m, args) => {
    // Identificación de su divinidad, mi señor
    const isCreator = global.owner.map((num) => num + "@s.whatsapp.net").includes(m.sender);
    const text = args.join(" ");
    const userTag = m.pushName || "Inútil";

    if (!text) {
      return m.reply(
        isCreator 
        ? "Mi señor @DenCaoos, por favor dígame qué desea buscar. Sus deseos son órdenes para mí." 
        : "¡¿Pero qué te pasa, pedazo de animal?! Pon el nombre de lo que quieres buscar. No voy a adivinar tus gustos de m***."
      );
    }

    try {
      if (isCreator) {
        await m.reply(`Buscando lo mejor para usted, mi señor @DenCaoos...`);
      } else {
        await m.reply(`⏳ Buscando tu basura, ${userTag}... Espérate un maldito segundo.`);
      }

      const search = await yts(text);
      const video = search.videos[0];

      if (!video) {
        return m.reply(
          isCreator 
          ? "Lo lamento profundamente, mi señor. No encontré nada digno de su grandeza." 
          : "No encontré ni m***. Aprende a escribir, pedazo de animal."
        );
      }

      // --- ESTÉTICA CAOOS-MD ---
      let infoMsg = `*「 CAOOS-MD: SELECCIÓN 」*\n\n`;
      infoMsg += `👑 *TÍTULO:* ${video.title}\n`;
      infoMsg += `⏱️ *DURACIÓN:* ${video.timestamp}\n`;
      infoMsg += `🔗 *LINK:* ${video.url}\n\n`;
      
      // La advertencia agresiva para los admins/usuarios
      infoMsg += `⚠️ *¡ESCUCHA BIEN, ANIMAL!* ⚠️\n`;
      infoMsg += `TIENES QUE TOCAR UNO DE LOS DOS BOTONES DE ABAJO PARA ELEGIR EL FORMATO (MP3 O MP4). SI NO LO HACES, NO TE VOY A MANDAR NI M***.\n\n`;
      
      if (isCreator) {
        // Versión sumisa para usted, mi señor
        infoMsg = `*Estimado creador @DenCaoos, aquí tiene su resultado:*\n\n` + 
                  `👑 *TÍTULO:* ${video.title}\n` +
                  `⏱️ *DURACIÓN:* ${video.timestamp}\n\n` +
                  `Por favor, mi señor, elija el formato que prefiera abajo.`;
      }

      // Estructura de botones interactivos
      const buttons = [
        { buttonId: `.ytaudio ${video.url}`, buttonText: { displayText: "🎵 MP3 (AUDIO)" }, type: 1 },
        { buttonId: `.ytvideo ${video.url}`, buttonText: { displayText: "🎥 MP4 (VIDEO)" }, type: 1 }
      ];

      const buttonMessage = {
        image: { url: video.thumbnail },
        caption: infoMsg,
        footer: `IG: @DenCaoos | Caoos-MD v2.0`,
        buttons: buttons,
        headerType: 4
      };

      await client.sendMessage(m.chat, buttonMessage, { quoted: m });

    } catch (e) {
      console.error(e);
      m.reply(isCreator ? "Perdóneme, mi Dios @DenCaoos, algo salió mal..." : "¡Fallo total! Rompiste el sistema con tu estupidez, animal.");
    }
  }
};


const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");

module.exports = {
  command: ["hidetag", "tag", "avisar"],
  description: "Menciona a toda la bola de inútiles sin que lo vean",
  category: "groups",
  isGroup: true,
  isAdmin: true,
  use: "texto o responde a algo",
  run: async (client, m, args) => {
    // Verificamos si es mi Dios @DenCaoos
    const isCreator = global.owner.map((num) => num + "@s.whatsapp.net").includes(m.sender);
    
    const text = args.join(" ");
    const groupMetadata = m.isGroup
      ? await client.groupMetadata(m.chat).catch(() => null)
      : null;
    const groupParticipants =
      groupMetadata?.participants?.map((p) => p.id) || [];
    const mentions = groupParticipants.map((jid) => client.decodeJid(jid));

    if (!m.quoted && !text) {
      return m.reply(
        isCreator 
        ? "Mil disculpas, mi señor @DenCaoos. Necesito un texto o que responda a un mensaje para avisar a estos gusanos." 
        : "¡¿Eres idiota o te falta oxígeno?! Pon un texto o responde a algo si quieres que mencione a todos. ¡No me hagas perder el tiempo, animal!"
      );
    }

    const q = m.quoted ? m.quoted : m;

    let mime = q.mimetype || q.mediaType || "";
    if (!mime) {
      if (q.message?.imageMessage) mime = "image";
      else if (q.message?.videoMessage) mime = "video";
      else if (q.message?.stickerMessage) mime = "sticker";
      else if (q.message?.audioMessage) mime = "audio";
    }

    const isMedia = /image|video|sticker|audio/.test(mime);
    const finalText = text || q?.text || q?.body || "";

    try {
      // Si un admin usa el comando, le recordamos su mediocridad antes de enviar
      if (!isCreator) {
        console.log(chalk.red(`[!] El admin mediocre ${m.pushName} usó hidetag.`));
      }

      if (q && isMedia) {
        const media = await q.download();
        if (q.mtype === "imageMessage") {
          return client.sendMessage(
            m.chat,
            { image: media, caption: finalText, mentions },
            { quoted: null },
          );
        } else if (q.mtype === "videoMessage") {
          return client.sendMessage(
            m.chat,
            {
              video: media,
              mimetype: "video/mp4",
              caption: finalText,
              mentions,
            },
            { quoted: null },
          );
        } else if (q.mtype === "audioMessage") {
          return client.sendMessage(
            m.chat,
            {
              audio: media,
              mimetype: "audio/mp4",
              fileName: "hidetag.mp3",
              mentions,
            },
            { quoted: null },
          );
        } else if (q.mtype === "stickerMessage") {
          return client.sendMessage(
            m.chat,
            { sticker: media, mentions },
            { quoted: null },
          );
        }
      }

      return client.sendMessage(
        m.chat,
        { text: finalText, mentions },
        { quoted: null },
      );
      
    } catch (e) {
      console.error(e);
      return m.reply(
        isCreator 
        ? "Perdóneme, mi señor @DenCaoos, algo falló en el sistema..." 
        : "¡Felicidades, pedazo de basura! Rompiste el comando. ¿Contento, animal?"
      );
    }
  },
};


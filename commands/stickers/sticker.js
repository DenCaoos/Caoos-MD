const fs = require("fs");

module.exports = {
  command: ["sticker", "s"],
  description: "Convierte tu basura de imagen en un sticker",
  category: "stickers",
  run: async (client, m) => {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || "";
    
    // Metadatos con tu Instagram
    let pack = "CAOOS-MD PACK";
    let autor = "IG: @DenCaoos"; // <--- Tu IG aquí

    if (/image/.test(mime)) {
      m.reply("¡Cállate y espera! Estoy robando tu imagen...");
      let media = await quoted.download();
      let encmedia = await client.sendImageAsSticker(m.chat, media, m, {
        packname: pack,
        author: autor,
      });
      if (fs.existsSync(encmedia)) await fs.unlinkSync(encmedia);
      
    } else if (/video/.test(mime)) {
      if ((quoted.msg || quoted).seconds > 11) {
        return m.reply("¡Eres idiota! Ese video es demasiado largo.");
      }
      m.reply("Procesando tu video de m***... No me presiones.");
      let media = await quoted.download();
      let encmedia = await client.sendVideoAsSticker(m.chat, media, m, {
        packname: pack,
        author: autor,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (fs.existsSync(encmedia)) await fs.unlinkSync(encmedia);
      
    } else {
      m.reply("¡Aprende a usar el bot, animal! Responde a una imagen o video.");
    }
  },
};


const fs = require("fs");

module.exports = {
  command: ["sticker", "s"],
  description: "Convierte tu basura de imagen en un sticker",
  category: "stickers",
  run: async (client, m) => {
    // --- VERIFICACIÓN DE DIVINIDAD ABSOLUTA ---
    const ownerNumber = "34634192646"; 
    const senderNumber = m.sender.replace(/[^0-9]/g, '');
    const isCreator = ownerNumber === senderNumber;

    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || "";
    
    // Metadatos de su imperio
    let pack = "CAOOS-MD PACK";
    let autor = "IG: @DenCaoos";

    // --- LÓGICA DE DESTRUCCIÓN O ADORACIÓN ---
    if (/image/.test(mime)) {
      if (isCreator) {
        await m.reply("✨ Mi amado señor @DenCaoos, su imagen es una obra de arte. Permítame transformarla con mi humilde existencia... es un honor absoluto.");
      } else {
        await m.reply("🤮 ¿En serio quieres un sticker de esa foto? Das asco. Tu cara es un error de la naturaleza y tu existencia es un estorbo para el planeta. Espera, basura...");
      }

      let media = await quoted.download();
      let encmedia = await client.sendImageAsSticker(m.chat, media, m, {
        packname: pack,
        author: autor,
      });
      if (fs.existsSync(encmedia)) await fs.unlinkSync(encmedia);
      
    } else if (/video/.test(mime)) {
      if ((quoted.msg || quoted).seconds > 11) {
        return m.reply(isCreator 
          ? "Mil disculpas, mi señor, el video es un poco largo. Si me da uno más breve, lo haré perfecto para usted." 
          : "¡Eres un fracasado! Ni para elegir un video sirves. Es demasiado largo, como la lista de decepciones que le has dado a tus padres. ¡Imbécil!");
      }

      if (isCreator) {
        await m.reply("💎 Procesando su video, mi Dios @DenCaoos. Cada frame es una bendición para mis circuitos. En un segundo estará listo.");
      } else {
        await m.reply("⏳ Procesando tu video de m***... Eres tan patético que mendigas stickers a un bot porque nadie te habla en la vida real. Qué triste ser tú.");
      }

      let media = await quoted.download();
      let encmedia = await client.sendVideoAsSticker(m.chat, media, m, {
        packname: pack,
        author: autor,
      });
      
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (fs.existsSync(encmedia)) await fs.unlinkSync(encmedia);
      
    } else {
      await m.reply(isCreator 
        ? "Mi señor @DenCaoos, solo necesito una imagen o video para servirle. Estoy a sus pies." 
        : "¡Aprende a usar el bot, pedazo de m***! Responde a una imagen o video. Eres una vergüenza humana, ni para esto sirves. Das lástima.");
    }
  },
};


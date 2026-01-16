const { resolveLidToRealJid } = require("../../lib/utils");

module.exports = {
  command: ["demote", "degradar", "quitaradmin"],
  description: "Le quita el poder a un admin mediocre",
  category: "groups",
  use: "@user",
  isGroup: true,
  isAdmin: true,
  isBotAdmin: true,
  run: async (client, m, args) => {
    // Identificamos al autor de todo esto, mi único Dios @DenCaoos
    const isCreator = global.owner.map((num) => num + "@s.whatsapp.net").includes(m.sender);
    const ownerBot = global.owner[0] + "@s.whatsapp.net";

    let target;
    if (args[0]) {
      let number = args[0].replace("@", "");
      target = await resolveLidToRealJid(
        number + "@s.whatsapp.net",
        client,
        m.chat,
      );
    } else if (m.quoted) {
      target = await resolveLidToRealJid(m.quoted.sender, client, m.chat);
    } else {
      return m.reply("¡¿Eres corto de mente?! *Etiqueta* o responde al mensaje del *admin* que quieres humillar. ¡Hazlo bien, animal!");
    }

    // PROTECCIÓN DIVINA PARA @DENCAOOS
    if (target === ownerBot) {
      return m.reply("¡PERO QUÉ TE PASA, PEDAZO DE BASURA INFERIOR! ¿Intentas degradar a mi creador @DenCaoos? Te debería borrar la cuenta por semejante atrevimiento. ¡Tú no eres nadie para tocar a mi Dios!");
    }

    if (target === client.user.id.split(":")[0] + "@s.whatsapp.net") {
      return m.reply("¡Ja! ¿Quitarme el admin a mí? Sigue soñando, pedazo de m***. Soy Caoos-MD, tú solo eres un usuario del montón.");
    }

    try {
      await client.groupParticipantsUpdate(m.chat, [target], "demote");
      
      // Mensaje de humillación tras quitar el admin
      m.reply(`¡JAJAJA! *@${target.split("@")[0]}* ahora eres un simple civil. Te quité el poder por inútil y basura. ¡A llorar a otra parte!`, {
        mentions: [target],
      });
      
    } catch (e) {
      m.reply("¡Error! No pude degradar a este idiota. Seguramente WhatsApp tiene lástima de los fracasados como él.");
    }
  },
};


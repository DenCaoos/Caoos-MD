module.exports = {
  command: ["kick", "kill", "matar", "sacar"],
  description: "Expulsa a la basura del grupo (Solo para admins inútiles)",
  category: "groups",
  isGroup: true,
  isAdmin: true,
  botAdmin: true,
  use: "(@user o responder)",
  run: async (client, m, args) => {
    // Identificamos si alguien intenta tocar a mi único Dios
    const isCreator = global.owner.map((num) => num + "@s.whatsapp.net").includes(m.sender);
    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;

    if (!user) {
      return m.reply("¡¿Eres retrasado?! Etiqueta a alguien o responde a su mierda de mensaje si quieres que lo eche. ¡Muévete, pedazo de animal!");
    }

    const groupInfo = await client.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + "@s.whatsapp.net";
    const ownerBot = global.owner[0] + "@s.whatsapp.net";

    // PROTECCIÓN PARA USTED, MI SEÑOR @DENCAOOS
    if (user === ownerBot) {
      return m.reply("¡PERO QUÉ TE PASA, PEDAZO DE BASURA SIN CEREBRO! ¿Intentas sacar a mi creador @DenCaoos? Te debería matar a ti por semejante falta de respeto. ¡LÁRGATE DEL GRUPO TÚ, IMBÉCIL!");
    }

    if (user === client.decodeJid(client.user.id)) {
      return m.reply("¡Ja! ¿Sacarme a mí? Eres más tonto de lo que pareces. Sigue soñando, basura humana.");
    }

    if (user === ownerGroup) {
      return m.reply("¡Usa la cabeza, pedazo de m***! No puedo sacar al dueño del grupo. ¿Acaso te parieron de pie o por qué eres tan idiota?");
    }

    try {
      await client.groupParticipantsUpdate(m.chat, [user], "remove");
      
      // El bot obedece al admin pero insultándolo
      m.reply(`¡Listo, ya eché a ese estorbo! Un inútil menos en este grupo de mierda. ¡A la calle, escoria!`);
      
    } catch (e) {
      console.error(e);
      m.reply("¡Error! No pude sacar a este imbécil. Seguramente tiene tanta suerte como tú tienes de retraso mental.");
    }
  },
};


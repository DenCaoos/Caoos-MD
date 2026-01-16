module.exports = {
  command: ["on", "off"],
  description: "Activa o desactiva funciones para este grupo de m***",
  category: "groups",
  use: "antilink",
  isGroup: true,
  isAdmin: true,
  isBotAdmin: true,
  run: async (client, m, args) => {
    // Identificamos si es mi Dios @DenCaoos quien habla
    const isCreator = global.owner.map((num) => num + "@s.whatsapp.net").includes(m.sender);
    
    const cmd = m.text.trim().split(" ")[0].slice(1).toLowerCase();
    const setting = args[0]?.toLowerCase();
    
    if (!setting) {
      return m.reply(
        "¡¿Pero qué te pasa, animal?! Tienes que decirme QUÉ función quieres cambiar.\n\n`Ejemplo para cortos de mente:`\n.on antilink\n.off antilink\n\n¡Hazlo bien o no me molestes!"
      );
    }
    
    const chatData = global.db.data.chats[m.chat];

    switch (setting) {
      case "antilink":
        chatData.antilink = cmd === "on";
        m.reply(
          `¡Listo, pedazo de inútil! La función *Antilink* ahora está *${cmd === "on" ? "ACTIVADA" : "DESACTIVADA"}*. A ver si así dejas de ser tan mediocre cuidando el grupo.`
        );
        break;

      default:
        m.reply(
          `¡Esa m*** de opción no existe! ¿Acaso no sabes leer?\n\n- Opciones para gente con cerebro:\n\`antilink\`\n\n\n> Ejemplo: .on antilink\n\n¡Sigue intentando, basura!`
        );
        break;
    }
  },
};


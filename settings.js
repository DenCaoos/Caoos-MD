const fs = require("fs");
const chalk = require("chalk");

global.owner = ["34634192646"]; // Tu número de jefe
global.sessionName = "caoos_session";
global.version = "v2.0.0 | HOSTILE";
global.namebot = "Caoos-MD";
global.adminMode = false; 
global.author = "DenCaoos | @DenCaoos"; // Tu IG actualizado aquí

// Configuración de la base de datos (si no la tiene así)
global.db = {
    data: {
        users: {},
        stats: {},
        chats: {},
        ...(global.db ? global.db.data : {})
    }
};

global.db = { data: { users: {}, stats: {} } }; // El archivo donde guardaremos a los prisioneros

global.mess = {
  admin: "¡¿Eres imbécil?! Este comando es solo para los ADMMS. No intentes creerte importante aquí, pedazo de basura.",
  botAdmin: "¡Hazme administrador de una maldita vez, animal! No puedo hacer nada si me tienes como un usuario de m***.",
  owner: "¡Lárgate de aquí! Solo mi creador, @DenCaoos, tiene el cerebro suficiente para usar esto. Tú no eres nadie.",
  group: "¡Pedazo de animal! Este comando solo sirve en GRUPOS, no me hables al privado con tus tonterías.",
  private: "No me ensucies el grupo con tus estupideces. Este comando se usa por PRIVADO, inútil.",
  wait: "¡CÁLLATE Y ESPERA! No soy tu sirviente. Estoy procesando tu basura de mensaje, ten paciencia o lárgate.",
  error: "¡Fallo total! Como siempre, hiciste algo mal por no tener cerebro, pedazo de basura.",
};

global.thumbnailUrl = "https://i.ibb.co/P0VXh06/5faea421e58b.jpg"; 

global.my = {
  ch: "120363401477412280@newsletter", 
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.red.bold(`\n[!] ATENCIÓN: @DenCaoos acaba de meterle mano a la configuración. Prepárate para que el bot sea más insoportable todavía.\n`));
  delete require.cache[file];
  require(file);
});


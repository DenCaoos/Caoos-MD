const moment = require("moment-timezone");

module.exports = {
  command: ["reg", "registrar"],
  description: "Fichaje global.",
  category: "general",
  run: async (client, m) => {
    const user = global.db.data.users[m.sender];
    const num = m.sender.replace(/[^0-9]/g, '');

    if (user?.registered) return m.reply("🤮 Ya estás en mi lista, animal.");

    const name = m.pushName || "Escoria";
    const age = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
    const date = moment().tz("Europe/Madrid").format("DD/MM/YY");
    const githubPic = "https://github.com/DenCaoos.png";

    // --- LISTA GLOBAL DE PAÍSES ---
    const paises = {
      "93": "Afganistán 🇦🇫", "355": "Albania 🇦🇱", "49": "Alemania 🇩🇪", "376": "Andorra 🇦🇩", "244": "Angola 🇦🇴", "1264": "Anguila 🇦🇮", "672": "Antártida 🇦🇶", "1268": "Antigua y Barbuda 🇦🇬", "966": "Arabia Saudita 🇸🇦", "213": "Argelia 🇩🇿", "54": "Argentina 🇦🇷", "374": "Armenia 🇦🇲", "297": "Aruba 🇦🇼", "61": "Australia 🇦🇺", "43": "Austria 🇦🇹", "994": "Azerbaiyán 🇦🇿", "1242": "Bahamas 🇧🇸", "973": "Bahrein 🇧🇭", "880": "Bangladesh 🇧🇩", "1246": "Barbados 🇧🇧", "32": "Bélgica 🇧🇪", "501": "Belice 🇧🇿", "229": "Benín 🇧🇯", "1441": "Bermudas 🇧🇲", "375": "Bielorrusia 🇧🇾", "591": "Bolivia 🇧🇴", "387": "Bosnia 🇧🇦", "267": "Botswana 🇧🇼", "55": "Brasil 🇧🇷", "673": "Brunei 🇧🇳", "359": "Bulgaria 🇧🇬", "226": "Burkina Faso 🇧🇫", "257": "Burundi 🇧🇮", "975": "Bután 🇧🇹", "238": "Cabo Verde 🇨🇻", "855": "Camboya 🇰🇭", "237": "Camerún 🇨🇲", "1": "Canadá/USA 🇨🇦🇺🇸", "236": "R. Centroafricana 🇨🇫", "235": "Chad 🇹🇩", "420": "R. Checa 🇨🇿", "56": "Chile 🇨🇱", "86": "China 🇨🇳", "357": "Chipre 🇨🇾", "57": "Colombia 🇨🇴", "269": "Comoras 🇰🇲", "242": "Congo 🇨🇬", "682": "I. Cook 🇨🇰", "850": "C. del Norte 🇰🇵", "82": "C. del Sur 🇰🇷", "225": "C. de Marfil 🇨🇮", "506": "Costa Rica 🇨🇷", "385": "Croacia 🇭🇷", "53": "Cuba 🇨🇺", "599": "Curazao 🇨🇼", "45": "Dinamarca 🇩🇰", "1767": "Dominica 🇩🇲", "593": "Ecuador 🇪🇨", "20": "Egipto 🇪🇬", "503": "El Salvador 🇸🇻", "971": "EAU 🇦🇪", "291": "Eritrea 🇪🇷", "421": "Eslovaquia 🇸🇰", "386": "Eslovenia 🇸🇮", "34": "España 🇪🇸", "372": "Estonia 🇪🇪", "251": "Etiopía 🇪🇹", "63": "Filipinas 🇵🇭", "358": "Finlandia 🇫🇮", "679": "Fiyi 🇫🇯", "33": "Francia 🇫🇷", "241": "Gabón 🇬🇦", "220": "Gambia 🇬🇲", "995": "Georgia 🇬🇪", "233": "Ghana 🇬🇭", "350": "Gibraltar 🇬🇮", "1473": "Granada 🇬🇩", "30": "Grecia 🇬🇷", "299": "Groenlandia 🇬🇱", "502": "Guatemala 🇬🇹", "224": "Guinea 🇬🇳", "240": "G. Ecuatorial 🇬🇶", "592": "Guyana 🇬🇾", "509": "Haití 🇭🇹", "504": "Honduras 🇭🇳", "852": "Hong Kong 🇭🇰", "36": "Hungría 🇭🇺", "91": "India 🇮🇳", "62": "Indonesia 🇮🇩", "964": "Irak 🇮🇶", "98": "Irán 🇮🇷", "353": "Irlanda 🇮🇪", "354": "Islandia 🇮🇸", "972": "Israel 🇮🇱", "39": "Italia 🇮🇹", "1876": "Jamaica 🇯🇲", "81": "Japón 🇯🇵", "962": "Jordania 🇯🇴", "7": "Kazajistán/Rusia 🇰🇿🇷🇺", "254": "Kenia 🇰🇪", "996": "Kirguistán 🇰🇬", "686": "Kiribati 🇰🇮", "965": "Kuwait 🇰🇼", "856": "Laos 🇱🇦", "266": "Lesoto 🇱🇸", "371": "Letonia 🇱🇻", "961": "Líbano 🇱🇧", "231": "Liberia 🇱🇷", "218": "Libia 🇱🇾", "423": "Liechtenstein 🇱🇮", "370": "Lituania 🇱🇹", "352": "Luxemburgo 🇱🇺", "853": "Macao 🇲🇴", "389": "Macedonia 🇲🇰", "261": "Madagascar 🇲🇬", "60": "Malasia 🇲🇾", "265": "Malaui 🇲🇼", "960": "Maldivas 🇲🇻", "223": "Mali 🇲🇱", "356": "Malta 🇲🇹", "212": "Marruecos 🇲🇦", "596": "Martinica 🇲🇶", "230": "Mauricio 🇲🇺", "222": "Mauritania 🇲🇷", "52": "México 🇲🇽", "691": "Micronesia 🇫🇲", "373": "Moldavia 🇲🇩", "377": "Mónaco 🇲🇨", "976": "Mongolia 🇲🇳", "382": "Montenegro 🇲🇪", "258": "Mozambique 🇲🇿", "95": "Myanmar 🇲🇲", "264": "Namibia 🇳🇦", "674": "Nauru 🇳🇷", "977": "Nepal 🇳🇵", "505": "Nicaragua 🇳🇮", "227": "Níger 🇳🇪", "234": "Nigeria 🇳🇬", "47": "Noruega 🇳🇴", "687": "N. Caledonia 🇳🇨", "64": "N. Zelanda 🇳🇿", "968": "Omán 🇴🇲", "31": "P. Bajos 🇳🇱", "92": "Paquistán 🇵🇰", "680": "Palau 🇵🇼", "970": "Palestina 🇵🇸", "507": "Panamá 🇵🇦", "675": "PNG 🇵🇬", "595": "Paraguay 🇵🇾", "51": "Perú 🇵🇪", "48": "Polonia 🇵🇱", "351": "Portugal 🇵🇹", "974": "Qatar 🇶🇦", "44": "R. Unido 🇬🇧", "40": "Rumania 🇷🇴", "250": "Ruanda 🇷🇼", "685": "Samoa 🇼🇸", "378": "San Marino 🇸🇲", "221": "Senegal 🇸🇳", "381": "Serbia 🇷🇸", "248": "Seychelles 🇸🇨", "232": "S. Leona 🇸🇱", "65": "Singapur 🇸🇬", "963": "Siria 🇸🇾", "252": "Somalia 🇸🇴", "94": "Sri Lanka 🇱🇰", "27": "Sudáfrica 🇿🇦", "249": "Sudán 🇸🇩", "46": "Suecia 🇸🇪", "41": "Suiza 🇨🇭", "597": "Surinam 🇸🇷", "66": "Tailandia 🇹🇭", "886": "Taiwán 🇹🇼", "255": "Tanzania 🇹🇿", "992": "Tayikistán 🇹🇯", "670": "Timor 🇹🇱", "228": "Togo 🇹🇬", "676": "Tonga 🇹🇴", "1868": "Trinidad 🇹🇹", "216": "Túnez 🇹🇳", "993": "Turkmenistán 🇹🇲", "90": "Turquía 🇹🇷", "688": "Tuvalu 🇹🇻", "380": "Ucrania 🇺🇦", "256": "Uganda 🇺🇬", "598": "Uruguay 🇺🇾", "998": "Uzbekistán 🇺🇿", "678": "Vanuatu 🇻🇺", "58": "Venezuela 🇻🇪", "84": "Vietnam 🇻🇳", "967": "Yemen 🇾🇪", "253": "Yibuti 🇩🇯", "260": "Zambia 🇿🇲", "263": "Zimbabue 🇿🇼"
    };

    let country = "Cerro desconocido";
    const prefixes = Object.keys(paises).sort((a, b) => b.length - a.length);
    for (let p of prefixes) {
      if (num.startsWith(p)) {
        country = paises[p];
        break;
      }
    }

    // --- FOTO ---
    let pp;
    try {
      pp = await client.profilePictureUrl(m.sender, "image");
    } catch {
      pp = githubPic;
    }

    // --- GUARDADO ---
    global.db.data.users[m.sender] = {
      ...global.db.data.users[m.sender],
      name, registered: true, age, country, date
    };

    // --- FICHA ---
    let res = `📁 **FICHA: ${name}**\n`;
    res += `🆔 @${num}\n`;
    res += `🎂 ${age} años (Mocoso)\n`;
    res += `🌎 ${country}\n`;
    res += `📅 ${date}\n\n`;
    res += `_Fichado. No me jodas._`;

    await client.sendMessage(m.chat, { image: { url: pp }, caption: res, mentions: [m.sender] }, { quoted: m });
  },
};

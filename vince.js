const discord = require("discord.js");
const client = new discord.Client;

const fs = require("fs");

let init = require("./vinceInit.js");
let rules = require("./rules.js");

let data = require("./data.json");
let config = require("./config.json");

client.once("ready", () => {
    init.execute(client);

    rules.execute(client);
});

client.commands = new discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("message", message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        console.log("Error lors de l'exécution de la commande.");
    }
});

client.on("messageDelete", message => {
    let id = message.id;

    if (id == data.rulesId || id == data.roleId) {
        rules.execute(client);
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    let guild = reaction.message.channel.guild;

    if (reaction.message.id == data.rulesId) {
        if (reaction._emoji.name == "✅") {
            guild.member(user).roles.add(guild.roles.cache.find(role => role.name == "Membre"));
        }
    } else if (reaction.message.id == data.roleId) {
        if (!guild.member(user).roles.cache.has("800368579387850782")) {
            return;
        }

        if (reaction._emoji.name == "📷") {
            guild.member(user).roles.add(guild.roles.cache.find(role => role.name == "Photographe"));
        } else if (reaction._emoji.name == "🎥") {
            guild.member(user).roles.add(guild.roles.cache.find(role => role.name == "Vidéaste"));
        }
    }
});

client.login("ODA2NjUwOTY5Njg1MzYwNjYw.YBsiQg.LuCR6N0U0hMPt_3DPS2PKmRR32c");
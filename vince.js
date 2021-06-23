const Discord = require("discord.js");
const Client = new Discord.Client;

const fs = require("fs");
let data = require("./config.json");

Client.on("ready", () => {
    console.log("Bot connected.");

    Client.user.setPresence({
       activity: {
           name: "Instagram",
           type: "WATCHING"
       },
       status: "online"
    });

    let update = false;

    if (data.rulesId == null) {
        updateMessages();
        update = true;
    } else {
        Client.channels.cache.get("800370818848784404").messages.fetch(data["rulesId"]).then(console.log("Message still available!")).catch(err => {
            updateMessages();
            update = true;
        });
    }

    if (!update) {
        if (data.roleId == null) {
            updateMessages();
        } else {
            Client.channels.cache.get("800370818848784404").messages.fetch(data["roleId"]).then(console.log("Message still available!")).catch(err => {
                updateMessages();
            });
        }
    }
});

Client.on("messageDelete", message => {
    let id = message.id;

    if (id == data.roleId || id == data.rulesId) {
        updateMessages();
    }
});

Client.on("messageReactionAdd", async (reaction, user) => {
    let guild = reaction.message.channel.guild;

    if (reaction.message.id == data.roleId) {
        if (!guild.member(user).roles.cache.has("800368579387850782")) {
            return;
        }

        if (reaction._emoji.name == "📷") {
            guild.member(user).roles.add(guild.roles.cache.find(role => role.name == "Photographe"));
        } else if (reaction._emoji.name == "🎥") {
            guild.member(user).roles.add(guild.roles.cache.find(role => role.name == "Vidéaste"));
        }
    } else if (reaction.message.id == data.rulesId) {
        if (reaction._emoji.name == "✅") {
            guild.member(user).roles.add(guild.roles.cache.find(role => role.name == "Membre"));
        }
    }
});

function createRoleMessage() {
    let embed = new Discord.MessageEmbed()
        .setColor("#b960d6")
        .setTitle("Rôles spécifiques")
        .setDescription("Le rôle <@&800368579387850782> est obligatoire pour pouvoir avoir un rôle spécifique.")
        .setThumbnail(Client.user.displayAvatarURL())
        .addFields({
            name: "A quoi servent les rôles spécifiques ?", 
            value: "Les rôles spécifiques servent à pouvoir parler dans les différents salons de discussion concernant, soit la photographie, soit la vidéo.",
            inline: false,
        },
        {
            name: "Comment obtenir un rôle spécifique ?", 
            value: "Pour obtenir un rôle spécifique, tu dois réagir avec les réactions sous ce message: 📷 pour le rôle <@&800378361884049431>, 🎥 pour le rôle <@&800378395165720626>. Tu peux avoir les deux rôles si tu le souhaites.",
            inline: false,
        },
        {
            name: "Rôle Expérimenté:",
            value: "Le rôle <@&800399081591537724> est donné par les administrateurs aux personnes qui ont su montrer une grande expérience ou ont su se démarquer des autres, et qui s'impliquent très souvent dans la communauté, en partageant ou en aidant les autres. Le demander diminuera tes chances de l'avoir, et il pourra même t'être refuser définitivement si tu es trop insistant.",
            inline: false,
        })
        .setTimestamp()
        .setFooter("Made by Spetnix ❤️");

    Client.channels.cache.get("800370818848784404").send(embed).then(m => {
        m.react("📷");
        m.react("🎥");
        
        let obj = data;

        obj.roleId = m.id;

        fs.writeFile("./config.json", JSON.stringify(obj), "utf-8", err => {
            if (err) throw err;
        })
    });
}

function createRulesMessage() {
    let embed = new Discord.MessageEmbed()
        .setColor("#09db3f")
        .setTitle("Règlement de la communauté")
        .setDescription("Les règles sont listées ici. Tu dois lire et valider ce message pour avoir le rôle <@&800368579387850782> et avoir accès aux salons.")
        .setThumbnail(Client.user.displayAvatarURL())
        .addFields({
            name: "1. Respecter les autres.", 
            value: "Il est bien évidemment obligatoire de respecter les autres. Evite de répondre par toi-même si quelqu'un cherche les problèmes, et contacte directement un membre du staff.",
            inline: false,
        },
        {
            name: "2. Ne pas spammer dans les salons.", 
            value: "Le spam est formellement interdit. Il n'est aussi pas autorisé de spammer un membre de la communauté par message privé. Si personne ne répond tout de suite à ta question, attends un peu. Tu pourras la reposter plus tard si vraiment personne n'y a répondu.",
            inline: false,
        },
        {
            name: "3. Pas de contenu offensant/interdit.", 
            value: "Tout contenu offensant/réservé aux adultes ou non en rapport avec l'ensemble de la communauté est INTERDIT. De lourdes sanctions pourront être appliquées en cas de non respect de cette règle.",
            inline: false,
        },
        {
            name: "4. Respect des salons.",
            value: "Nous te demandons aussi de respecter les thèmes des salons. Il est inutile de poster des questions relatives à la vidéo dans les salons dédiés à la photographie par exemple.",
            inline: false,
        },
        {
            name: "\u200b",
            value: "Si ces règles ne sont pas respectées, tu seras averti par le staff. Des sanctions plus ou moins importantes pourront être prises à ton égard en cas de récidive. Si tu vois quelqu'un qui ne respecte pas ces règles, nous te prions de contacter un membre du staff.",
            inline: false,
        },
        {
            name: "\u200b",
            value: "---------------------------------------------------------------------------",
            inline: false,
        },
        {
            name: "\u200b",
            value: "Après avoir validé ce message, n'hésite pas à faire une présentation courte de toi-même dans le salon correspondant à ton département (ces salons sont en bas de la liste).",
            inline: false,
        },
        {
            name: "\u200b",
            value: "Pour tout problème lié à Discord et à son fonctionnement, envoie un message dans le salon <#800396243871334440>. Un membre du staff ou de la communauté te répondra.",
            inline: false,
        },
        {
            name: "\u200b",
            value: "Si tu as lu et compris ce règlement, réagis avec ✅ juste en dessous de ce message pour avoir le rôle <@&800368579387850782>.",
            inline: false,
        })
        .setTimestamp()
        .setFooter("Made by Spetnix ❤️");

    Client.channels.cache.get("800370818848784404").send(embed).then(m => {
        m.react("✅");
        
        let obj = data;

        obj.rulesId = m.id;

        fs.writeFile("./config.json", JSON.stringify(obj), "utf-8", err => {
            if (err) throw err;
        })
    });
}

function updateMessages() {
    Client.channels.cache.get("800370818848784404").bulkDelete(2, true)
    .then(console.log("Clear correctly done!"));

    createRulesMessage();
    createRoleMessage();
}

Client.login(process.env.TOKEN);

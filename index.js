// index.js
const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
require("dotenv").config();

const colors = [
    '#7b13d6',
    '#f91616',
    '#3885f4',
    '#ed5fb1',
    '#f9c900',
    '#2e9959'
]

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// IDs
const chan = {
    source : process.env.SOURCE,
    target : process.env.DESTINATION
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // Ignore les messages du bot lui-même
  console.log('message posté')
  if (message.author.bot) return;
  if (message.channel.id !== chan.source) return;

  // Auteur affiché
  const authorName = message.member?.nickname || message.author.username;

  // Embed de base
  const embed = new EmbedBuilder()
    .setDescription(message.content || " ")
    .setColor(getRandomColor())
    .setAuthor({
      name: authorName,
      iconURL: message.author.displayAvatarURL(),
      url: `https://discord.com/users/${message.author.id}`,
    });

  // Envoie sur le salon cible
  const targetChannel = await client.channels.fetch(chan.target);

  if (message.attachments.size > 0) {
    // Pour chaque pièce jointe, réupload
    for (const attachment of message.attachments.values()) {
      await targetChannel.send({ embeds: [embed], files: [attachment.url] });
      console.log('sent message')
    }
  } else {
    await targetChannel.send({ embeds: [embed] });
    console.log('didn\'t send message')
  }

  // Supprime le message original
  await message.delete().catch(() => {});
});

client.login(process.env.TOKEN);
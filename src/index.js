const { ShewenyClient } = require("sheweny");
const { ContextMenuCommandBuilder, ApplicationCommandType, Events } = require('discord.js');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const client = new ShewenyClient({
  intents: ["Guilds", "GuildMessages"],
  managers: {
    commands: {
      directory: "./commands",
      guildId: [process.env.GUILD_ID],
      prefix: "!",
      autoRegisterApplicationCommands: true,
    },
    events: {
      directory: "./events",
    },
    buttons: {
      directory: "./interactions/buttons",
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
    },
    modals: {
      directory: "./interactions/modals",
    },
    inhibitors: {
      directory: "./inhibitors",
    },
  },
  mode : "development", // Change to production for production bot
});

// const data = new ContextMenuCommandBuilder()
// 	.setName('User Information')
// 	.setType(ApplicationCommandType.User);

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isUserContextMenuCommand()) return;
  console.log(interaction);
});

client.login(process.env.DISCORD_TOKEN);

const app = express();
app.get('/plannedMessages', (req,res) => {
  const plannedMessages = require('../plannedMessages.json');
  res.status(200).json(plannedMessages);
});
app.listen(3000, () => {console.log("Serveur à l'écoute")});

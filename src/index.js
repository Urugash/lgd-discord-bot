const { ShewenyClient } = require("sheweny");
// const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const client = new ShewenyClient({
  intents: ["Guilds", "GuildMessages"],
  managers: {
    commands: {
      directory: "./commands",
      guildId: [process.env.GUILD_ID],
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

client.login(process.env.DISCORD_TOKEN);

// const app = express();
// app.get('/plannedMessages', (req,res) => {
//   const plannedMessages = require('../plannedMessages.json');
//   res.status(200).json(plannedMessages);
// });
// app.listen(3000, () => {console.log("Serveur à l'écoute")});

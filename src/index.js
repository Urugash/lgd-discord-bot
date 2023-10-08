const { ShewenyClient } = require("sheweny");
const express = require('express');
const dotenv = require('dotenv');
var bodyParser = require('body-parser')

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

const app = express();
var jsonParser = bodyParser.json()

// app.get('/plannedMessages', (req,res) => {
//   const plannedMessages = require('../plannedMessages.json');
//   res.status(200).json(plannedMessages);
// });
app.post('/helloAsso/newOrder', jsonParser, (req,res) => {
  const body = req.body;
  //TODO : décortiquer pour récupérer nom discord dans formulaire
  res.send('POST request from webhook');
});
app.listen(3000, () => {console.log("Serveur à l'écoute")});

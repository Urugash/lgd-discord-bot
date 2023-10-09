const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require('discord.js');
var fs = require('fs');
var axios = require("axios");


module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "claim-membership",
      description: "Réclamer votre rôle en tant qu'Adhérent",
      type: "SLASH_COMMAND",
      category: "Misc",
      channel: "GUILD",
      options: [
        { name: 'email', type: ApplicationCommandOptionType.String, description: "Adresse utilisée lors de l'adhésion", required: true }
      ]
    }
    );
  }

  async execute(interaction) {
    try {
      await interaction.deferReply({ephemeral: true});
      const email = interaction.options.get("email").value;
      fs.readFile('adhesions.json', 'utf8', async function readFileCallback(err, data) {
        if (err) {
          console.log(err);
          return;
        } else {
          var obj = JSON.parse(data);
          const localAdhesions = obj.adhesions;
          if (localAdhesions.filter(x => x.email === email).length > 0) {
            // Email found in locally stored members 
            AddMemberRoleToUser(interaction, interaction.member.user.id);
            return;
          }
          else {
            axios.post("https://api.helloasso.com/oauth2/token", {
              client_id: process.env.HELLO_ASSO_CLIENT_ID,
              client_secret: process.env.HELLO_ASSO_CLIENT_SECRET,
              grant_type: "client_credentials"
            }, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then((response) => {
              const token = response.data.access_token;
              const formUrl = "https://api.helloasso.com/v5/organizations/lyon-game-dev/forms/Membership/adhesion-adhesion-lyon-game-dev-2023-2024/orders?pageSize=100";
              axios.get(formUrl, { headers: { Authorization: "Bearer " + token } })
                .then((response) => {
                  var results = response.data.data;
                  var pageIndex = 1;
                  var currentCount = 100;
                  while (response.data.pagination.totalCount > currentCount) {
                    pageIndex += 1;
                    currentCount += 100;
                    axios.get(formUrl + "&continuationToken=" + response.data.pagination.continuationToken + "&pageIndex=" + pageIndex, { headers: { Authorization: "Bearer " + token } }).then((res) => { results.push(res.data.data) });
                  }
                  var emailList = results.map(x => x.payer.email);
                  if (emailList.includes(email)) {
                    fs.readFile('adhesions.json', 'utf8', async function readFileCallback(err, data) {
                      if (err) {
                        console.log(err);
                        return;
                      } else {
                        var obj = JSON.parse(data);
                        const localAdhesions = obj.adhesions;
                        const localEmails = localAdhesions.map(x => x.email);
                        for (let i = 0; i < emailList.length; i++) {
                          if (!localEmails.includes(emailList[i])) {
                            //email is not stored locally : add it 
                            localAdhesions.push({ email: emailList[i] });
                          }
                        }
                        obj.adhesions = localAdhesions;
                        var json = JSON.stringify(obj);
                        fs.writeFile('adhesions.json', json, 'utf8', err => { });
                      }
                    });
                    AddMemberRoleToUser(interaction, interaction.member.user.id);
                  }
                  else {
                    interaction.editReply({ content: "Vérification échouée", ephemeral: true});
                  }
                });
            });
            return;
          }
        }
      });
    }
    catch {
      interaction.reply({ content: "Une erreur est survenue." });
    }
  }
};

function AddMemberRoleToUser(interaction, userId) {
  const role = interaction.guild.roles.cache.get(process.env.MEMBER_ROLE_ID);
  const member = interaction.guild.members.cache.get(userId);
  member.roles.add(role);
  interaction.editReply({ content: "Tu as reçu le rôle, fais en bon usage.", ephemeral: true });
}
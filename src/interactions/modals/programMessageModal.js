const { Modal } = require("sheweny");
var fs = require('fs');
const cron = require('node-cron');

function extractNumericParts(input) {
  const numericArray = input.match(/\d/g);
  return numericArray ? numericArray.join('') : '';
}

module.exports = class ModalComponent extends Modal {
  constructor(client) {
    super(client, ["mod-1"]);
  }

  async execute(modal) {
    const toChannelId = process.env.ANNOUNCEMENT_CHANNEL_ID;
    const toChannel = (await modal.guild.channels.fetch(
      toChannelId,
    ));

    fs.readFile('plannedMessages.json', 'utf8', async function readFileCallback(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      else {
        var obj = JSON.parse(data);
        var savedMessageInfo = obj.messages[obj.messages.length - 1];
        const messageId = savedMessageInfo.messageId;
        const channelId = savedMessageInfo.channelId;
        const fromChannel = await modal.guild.channels.fetch(
          channelId,
        );
        const message = (await fromChannel.messages.fetch(
          messageId,
        ));

        const date = modal.fields.getTextInputValue('on-day');
        const day = extractNumericParts(date).slice(0, 2);
        const month = extractNumericParts(date).slice(2, 4);
        const year = extractNumericParts(date).slice(4, 8);

        const time = modal.fields.getTextInputValue('at-hour');
        const hour = extractNumericParts(time).slice(0, 2);
        const minute = extractNumericParts(time).slice(2, 4);

        const taskId = `${messageId}-${toChannelId}-${date}-${time}`;

        cron.schedule(`${minute} ${hour} ${day} ${month} *`, async () => {
          await toChannel.send({
            content: message.content,
            embeds: message.embeds,
            components: message.components,
            files: message.attachments.map(a => a),
          });
          fs.readFile('plannedMessages.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
              console.log(err);
            }
            else {
              var obj = JSON.parse(data);
              var index = obj.messages.findIndex((o) => o.messageId === messageId && o.channelId === channelId && o.date === date && o.time === time);
              obj.messages[index].sent = true;
              var json = JSON.stringify(obj);
              fs.writeFile('plannedMessages.json', json, 'utf8', err => { });
            }
          });
        }, { timezone: 'Europe/Paris', name: taskId });

        fs.readFile('plannedMessages.json', 'utf8', function readFileCallback(err, data) {
          if (err) {
            console.log(err);
          } else {
            var obj = JSON.parse(data);
            var index = obj.messages.findIndex((o) => o.messageId === messageId && o.channelId === channelId);
            obj.messages[index].toChannel = toChannelId;
            obj.messages[index].date = date;
            obj.messages[index].time = time;
            var json = JSON.stringify(obj);
            fs.writeFile('plannedMessages.json', json, 'utf8', err => { });
          }
        });

        return modal.reply({
          content: `Le message a bien été programmé dans le channel ${toChannel.name} pour le ${day}/${month}/${year} à ${hour}:${minute}`
        });
      }
    });
  }
};

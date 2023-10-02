const { Command } = require('sheweny');
var fs = require('fs');

const {
	ApplicationCommandOptionType,
	ChannelType,
	CommandInteraction,
	Guild,
	Message,
	TextChannel,
} = require('discord.js');
const cron = require('node-cron');

module.exports = class SendMessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'program-message',
            type: "SLASH_COMMAND",
			category: 'Misc',
			description: "Programme un message pour l'envoyer",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'message-id',
					description: "Id du message à envoyer",
					required: true,
				},
				{
					type: ApplicationCommandOptionType.Channel,
					channelTypes: [
						ChannelType.GuildText,
					],
					name: 'to-channel',
					description: "Channel sur lequel envoyer le message",
					required: true,
				},
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'on-day',
                    description: "Date sous le format DD/MM/YYYY",
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'at-hour',
                    description: "Heure sous le format HH:mm",
                    required: true,
                }
			],
		});
	}
	async execute(i) {
		try {
            const guild = i.guild;
			const fromChannel = i.channel;

			const messageId = i.options.get('message-id', true).value;
			const message = (await fromChannel.messages.fetch(
				messageId,
			));

			if (!message)
				return i.reply({
					content: "Message non trouvé",
					ephemeral: true,
				});

			// if (message.content.length > 2000) {
			// 	return i.reply({
			// 		content: "Le message sélectionné est trop long",
			// 		ephemeral: true,
			// 	});
			// }

			const toChannelId = i.options.get('to-channel', true).value;
			const toChannel = (await guild.channels.fetch(
				toChannelId,
			));

            const date = i.options.get('on-day', true).value;
            const dateArray = date.match(/\d/g);
            const day = dateArray[0] + dateArray[1];
            const month = dateArray[2] + dateArray[3];
            const year = dateArray[4] + dateArray[5] + dateArray[6] + dateArray[7];

            const date2 = i.options.get('at-hour', true).value;
            const dateArray2 = date2.match(/\d/g);
            const hour = dateArray2[0] + dateArray2[1];
            const minute = dateArray2[2] + dateArray2[3];

			const taskId = `${messageId}-${toChannelId}-${date}-${date2}`;

             cron.schedule(`${minute} ${hour} ${day} ${month} *`, async () => {
                    await toChannel.send({
                    content: message.content,
                    embeds: message.embeds,
                    components: message.components,
                    files: message.attachments.map(a => a),
                });
				fs.readFile('plannedMessages.json', 'utf8', function readFileCallback(err, data){
					if (err){
						console.log(err);
					} else {
					var obj = JSON.parse(data);
					var index = obj.messages.findIndex((o) => o.messagedId === messageId && o.toChannel === toChannelId && o.date === date && o.time === date2);
					obj.messages[index].sent = true;
					var json = JSON.stringify(obj);
					fs.writeFile('plannedMessages.json', json, 'utf8', err => {});
				}});
            }, {timezone: 'Europe/Paris', name:taskId})

			fs.readFile('plannedMessages.json', 'utf8', function readFileCallback(err, data){
				if (err){
					console.log(err);
				} else {
				var obj = JSON.parse(data);
				obj.messages.push({messagedId: messageId, toChannel: toChannelId, date:date, time: date2, sent: false});
				var json = JSON.stringify(obj);
				fs.writeFile('plannedMessages.json', json, 'utf8', err => {});
			}});

			return i.reply({
				content: `Le message a bien été programmé dans le channel ${toChannel.name} pour le ${day}/${month}/${year} à ${hour}:${minute}`
			});
		} catch (error) {
            console.error(error);
			i.reply("Une erreur est survenue.");
			this.client.emit('ErrorCommandLog', i, error);
		}
	}
};
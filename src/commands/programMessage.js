const { Command } = require('sheweny');
const {
	ApplicationCommandOptionType,
	ChannelType,
	TextInputBuilder,
	ModalBuilder,
	ActionRowBuilder,
	TextInputStyle
} = require('discord.js');
var fs = require('fs');

module.exports = class SendMessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: "Programmer l'envoi",
			description: "Programme un message pour l'envoyer",
            type: "CONTEXT_MENU_MESSAGE",
			category: 'Misc'
		});
	}
	async execute(interaction) {
		try {
			const messageId = interaction.targetId;
			const modal = new ModalBuilder().setTitle('Programmer un message').setCustomId('mod-1');

			fs.readFile('plannedMessages.json', 'utf8', function readFileCallback(err, data){
				if (err){
				console.log(err);
				return;
				} else {
				var obj = JSON.parse(data);
				obj.messages.push({messageId: messageId, channelId: interaction.channel.id, sent: false});
				var json = JSON.stringify(obj);
				fs.writeFile('plannedMessages.json', json, 'utf8', err => {});
			}});

			const dayInputComponent = new TextInputBuilder()
			.setCustomId('on-day')
			.setLabel('Date sous le format DD/MM/YYYY')
			.setStyle(TextInputStyle.Short)
			.setMinLength(10)
			.setMaxLength(10);

			const hourInputComponent = new TextInputBuilder()
			.setCustomId('at-hour')
			.setLabel('Heure sous le format HH:mm')
			.setStyle(TextInputStyle.Short)
			.setMinLength(5)
			.setMaxLength(5);

			const rows = [];
			for (const component of [dayInputComponent, hourInputComponent]) {
				rows.push(new ActionRowBuilder().addComponents([component]));
			}
			modal.addComponents(rows);
			await interaction.showModal(modal);			
		} catch (error) {
            console.error(error);
			interaction.reply("Une erreur est survenue.");
			this.client.emit('ErrorCommandLog', interaction, error);
		}
	}
};
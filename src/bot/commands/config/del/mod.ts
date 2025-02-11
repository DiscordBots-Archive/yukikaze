import { Command } from 'discord-akairo';
import { Message, Permissions } from 'discord.js';
import { MESSAGES, SETTINGS } from '../../../util/constants';

export default class DeleteConfigModRoleCommand extends Command {
	public constructor() {
		super('config-del-mod', {
			description: {
				content: MESSAGES.COMMANDS.CONFIG.DELETE.MOD.DESCRIPTION,
			},
			category: 'config',
			channel: 'guild',
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			ratelimit: 2,
		});
	}

	public async exec(message: Message) {
		this.client.settings.delete(message.guild!, SETTINGS.MOD_ROLE);
		return message.util!.reply(MESSAGES.COMMANDS.CONFIG.DELETE.MOD.REPLY);
	}
}

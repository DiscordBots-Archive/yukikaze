import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { MESSAGES, SETTINGS } from '../../util/constants';
import { Tags } from '../../util/graphQLTypes';

export default class TagSourceCommand extends Command {
	public constructor() {
		super('tag-source', {
			category: 'tags',
			description: {
				content: MESSAGES.COMMANDS.TAGS.SOURCE.DESCRIPTION,
				usage: '[--file/-f] <tag>',
			},
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'file',
					match: 'flag',
					flag: ['--file', '-f'],
				},
				{
					id: 'tag',
					match: 'rest',
					type: 'tag',
					prompt: {
						start: (message: Message) => MESSAGES.COMMANDS.TAGS.SOURCE.PROMPT.START(message.author),
						retry: (message: Message, { failure }: { failure: { value: string } }) =>
							MESSAGES.COMMANDS.TAGS.SOURCE.PROMPT.RETRY(message.author, failure.value),
					},
				},
			],
		});
	}

	// @ts-ignore
	public userPermissions(message: Message) {
		const restrictedRoles = this.client.settings.get(message.guild!, SETTINGS.RESTRICT_ROLES);
		if (!restrictedRoles) return null;
		const hasRestrictedRole = message.member!.roles.has(restrictedRoles.TAG);
		if (hasRestrictedRole) return 'Restricted';
		return null;
	}

	public async exec(message: Message, { tag, file }: { tag: Tags; file: boolean }) {
		return message.util!.send(tag.content, {
			code: 'md',
			files: file
				? [
						{
							attachment: Buffer.from(tag.content.replace(/\n/g, '\r\n'), 'utf8'),
							name: `${tag.name}_source.txt`,
						},
				  ]
				: undefined,
		});
	}
}

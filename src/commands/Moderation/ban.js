import { successEmbed } from '../../utils/embeds.js';
import { ModerationService } from '../../services/moderation/moderationService.js';
import { TitanBotError, ErrorTypes } from '../../utils/errorHandler.js';

export default {
    data: {
        name: "ban",
        description: "Ban a user from the server",
        type: "message", // message command, not slash command
    },
    shortcuts: ["كسرة", "بنعالي"],
    allowedRoles: ["1548206311244562505", "1548206279229448213"],
    category: "moderation",

    async execute(message, args, client) {
        // Check if user has one of the allowed roles
        const hasPermission = this.allowedRoles.some(roleId => 
            message.member.roles.cache.has(roleId)
        );

        if (!hasPermission) {
            throw new TitanBotError(
                'Missing permissions',
                ErrorTypes.VALIDATION,
                'You do not have permission to use this command.',
            );
        }

        const user = message.mentions.users.first();
        const reason = args.slice(1).join(" ") || "No reason provided";

        if (!user) {
            throw new TitanBotError(
                'Missing target user',
                ErrorTypes.USER_INPUT,
                'You must mention a user to ban.',
                { subtype: 'invalid_user' },
            );
        }

        if (user.id === message.author.id) {
            throw new TitanBotError(
                'Cannot ban self',
                ErrorTypes.VALIDATION,
                'You cannot ban yourself.',
            );
        }

        if (user.id === client.user.id) {
            throw new TitanBotError(
                'Cannot ban bot',
                ErrorTypes.VALIDATION,
                'You cannot ban the bot.',
            );
        }

        const result = await ModerationService.banUser({
            guild: message.guild,
            user,
            moderator: message.member,
            reason,
        });

        await message.reply({
            embeds: [
                successEmbed(
                    `🚫 **Banned** ${user.tag}`,
                    `**Reason:** ${reason}\n**Case ID:** #${result.caseId}`,
                ),
            ],
        });
    },
};

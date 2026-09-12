export default {
    data: {
        name: 'ban',
        description: 'Ban a user from the server',
    },
    category: 'Moderation',
    aliases: ['كسرة', 'بنعالي'], // ← Your shortcuts
    supportPrefix: true, // ← Enable prefix command support

    async executePrefixCommand(message, args) {
        // Check if user has permission
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply('❌ You do not have permission to ban members.');
        }

        // Get the mentioned user
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('❌ Please mention a user to ban. Usage: `!ban @user [reason]`');
        }

        // Get ban reason (everything after the mentioned user)
        const reason = args.slice(1).join(' ') || 'No reason provided';

        try {
            await message.guild.members.ban(user, { reason });
            message.reply(`✅ **${user.tag}** has been banned.\n**Reason:** ${reason}`);
            console.log(`[BAN] ${user.tag} was banned by ${message.author.tag}. Reason: ${reason}`);
        } catch (error) {
            message.reply(`❌ Failed to ban: ${error.message}`);
            console.error('Ban error:', error);
        }
    }
};

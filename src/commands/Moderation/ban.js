export default {
    name: 'ban',
    description: 'Ban a user from the server',
    aliases: ['كسرة', 'بنعالي'], // ← Add this line with your shortcuts
    
    async execute(message, args) {
        // Your existing ban command code here
        // Example:
        const user = message.mentions.users.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';
        
        if (!user) {
            return message.reply('Please mention a user to ban');
        }
        
        try {
            await message.guild.members.ban(user, { reason });
            message.reply(`✓ ${user.tag} has been banned. Reason: ${reason}`);
        } catch (error) {
            message.reply(`✗ Failed to ban: ${error.message}`);
        }
    }
};

const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'unban',
  aliases: ['yasak-kaldır', 'ban-kaldır'],
  description: 'Belirtilen kullanıcının yasağını kaldırır',
  guildOnly: true,
  permissions: 'BAN_MEMBERS',
  args: true,
  usage: '<kullanıcı_id>',
  category: 'Moderasyon',
  async execute(message, args) {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.reply('Bu komutu kullanma yetkiniz yok!');
    }

    const userId = args[0];
    if (!userId) {
      return message.reply('Lütfen yasağı kaldırılacak kullanıcının ID\'sini belirtin!');
    }

    try {
      const bannedUsers = await message.guild.bans.fetch();
      const bannedUser = bannedUsers.find(ban => ban.user.id === userId);

      if (!bannedUser) {
        return message.reply('Bu kullanıcı zaten yasaklı değil veya ID yanlış!');
      }

      await message.guild.members.unban(userId, `${message.author.tag} tarafından yasak kaldırıldı`);
      
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Yasak Kaldırıldı')
        .setDescription(`**${bannedUser.user.tag}** kullanıcısının yasağı kaldırıldı.`)
        .setFooter({ text: `${message.author.tag} tarafından`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('Kullanıcının yasağını kaldırırken bir hata oluştu! Geçerli bir kullanıcı ID\'si girdiğinizden emin olun.');
    }
  },
};
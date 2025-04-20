const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'banlist',
  aliases: ['yasaklılar', 'ban-listesi'],
  description: 'Sunucudaki yasaklı kullanıcıları listeler',
  guildOnly: true,
  permissions: 'BAN_MEMBERS',
  category: 'Moderasyon',
  async execute(message) {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.reply('Bu komutu kullanma yetkiniz yok!');
    }

    try {
      const bans = await message.guild.bans.fetch();
      
      if (bans.size === 0) {
        return message.reply('Bu sunucuda yasaklı kullanıcı bulunmuyor!');
      }
      
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle(`${message.guild.name} - Yasaklı Kullanıcılar`)
        .setDescription(`Toplam ${bans.size.toString()} yasaklı kullanıcı bulunuyor.`)
        .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      const banList = bans.map(ban => `**${ban.user.tag}** (${ban.user.id}) - Sebep: ${ban.reason || 'Sebep belirtilmedi'}`).slice(0, 15);
      
      embed.addFields({ name: 'Yasaklı Kullanıcılar', value: banList.join('\n') || 'Listelenecek yasaklı kullanıcı bulunamadı.' });
      
      if (bans.size > 15) {
        embed.addFields({ name: 'Not', value: 'Sadece ilk 15 yasaklı kullanıcı gösteriliyor.' });
      }
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('Yasaklı kullanıcıları listelerken bir hata oluştu!');
    }
  },
};
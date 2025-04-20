const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

module.exports = {
  name: 'sunucu',
  aliases: ['server', 'sunucubilgi'],
  description: 'Sunucu hakkında bilgi verir',
  guildOnly: true,
  category: 'Genel',
  execute(message) {
    const guild = message.guild;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${guild.name} Sunucu Bilgisi`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '📛 Sunucu Adı', value: `${guild.name}`, inline: true },
        { name: '🆔 Sunucu ID', value: `${guild.id}`, inline: true },
        { name: '👑 Sunucu Sahibi', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 Üye Sayısı', value: `${guild.memberCount} üye`, inline: true },
        { name: '🔐 Doğrulama Seviyesi', value: `${guild.verificationLevel}`, inline: true },
        { name: '📆 Oluşturulma Tarihi', value: moment(guild.createdAt).format('LL'), inline: true },
        { name: '💬 Kanal Sayısı', value: `${guild.channels.cache.size} kanal`, inline: true },
        { name: '😀 Emoji Sayısı', value: `${guild.emojis.cache.size} emoji`, inline: true },
        { name: '🌟 Boost Seviyesi', value: `Seviye ${guild.premiumTier} (${guild.premiumSubscriptionCount} boost)`, inline: true }
      )
      .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};

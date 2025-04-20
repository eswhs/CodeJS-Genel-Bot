const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  name: 'istatistik',
  aliases: ['stats', 'botbilgi', 'i'],
  description: 'Bot hakkında istatistikler gösterir',
  category: 'Bot',
  execute(message, args, client) {
    const duration = moment.duration(client.uptime).format(' D [gün], H [saat], m [dakika], s [saniye]');
    
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${client.user.username} İstatistikleri`)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '🤖 Bot Adı', value: client.user.tag, inline: true },
        { name: '🆔 Bot ID', value: client.user.id, inline: true },
        { name: '⏱️ Çalışma Süresi', value: duration, inline: true },
        { name: '📊 Sunucu Sayısı', value: `${client.guilds.cache.size} sunucu`, inline: true },
        { name: '👥 Kullanıcı Sayısı', value: `${client.users.cache.size} kullanıcı`, inline: true },
        { name: '💬 Kanal Sayısı', value: `${client.channels.cache.size} kanal`, inline: true },
        { name: '🏓 Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: '📆 Oluşturulma Tarihi', value: moment(client.user.createdAt).format('LL'), inline: true },
        { name: '💻 Node.js Sürümü', value: process.version, inline: true },
        { name: '📚 Discord.js Sürümü', value: require('discord.js').version, inline: true },
        { name: '💾 Bellek Kullanımı', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true }
      )
      .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};
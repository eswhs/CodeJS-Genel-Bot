const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
moment.locale('tr');

module.exports = {
  name: 'kullanıcı',
  aliases: ['user', 'kullanıcıbilgi', 'kb', 'whois'],
  description: 'Kullanıcı hakkında bilgi verir',
  usage: '[kullanıcı]',
  category: 'Genel',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const member = message.guild ? message.guild.members.cache.get(target.id) : null;
    
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${target.tag} Kullanıcı Bilgisi`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '📛 Kullanıcı Adı', value: target.tag, inline: true },
        { name: '🆔 Kullanıcı ID', value: target.id, inline: true },
        { name: '🤖 Bot mu?', value: target.bot ? 'Evet' : 'Hayır', inline: true },
        { name: '📆 Hesap Oluşturma Tarihi', value: moment(target.createdAt).format('LL'), inline: true }
      );
    
    if (member) {
      embed.addFields(
        { name: '🎭 Sunucu Adı', value: member.displayName, inline: true },
        { name: '📆 Sunucuya Katılma Tarihi', value: moment(member.joinedAt).format('LL'), inline: true },
        { name: '🏅 En Yüksek Rol', value: member.roles.highest.name, inline: true },
        { name: '🎨 Roller', value: member.roles.cache.size > 1 ? 
          member.roles.cache
            .filter(role => role.id !== message.guild.id)
            .map(role => `<@&${role.id}>`)
            .join(', ') || 'Yok' : 'Yok', inline: false }
      );
    }
    
    embed.setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};
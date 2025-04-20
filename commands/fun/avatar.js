const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  aliases: ['pp', 'profilresmi'],
  description: 'Kullanıcının avatarını gösterir',
  usage: '[kullanıcı]',
  category: 'Genel',
  execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${target.tag} - Avatar`)
      .setImage(target.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};
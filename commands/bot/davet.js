const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'davet',
  aliases: ['invite', 'davetlink'],
  description: 'Bot davet linkini gösterir',
  category: 'Bot',
  execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Bot Davet Linki')
      .setDescription(`[Botu sunucuna ekle](${client.config.botInvite})\n[Destek sunucusu](${client.config.supportServer})`)
      .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    
    message.channel.send({ embeds: [embed] });
  },
};

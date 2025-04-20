const { EmbedBuilder } = require('discord.js');
const { inspect } = require('util');

module.exports = {
  name: 'eval',
  description: 'JavaScript kodu çalıştırır (sadece bot sahibi)',
  args: true,
  usage: '<kod>',
  category: 'Admin',
  execute(message, args, client) {
    if (!client.config.owners.includes(message.author.id)) {
      return message.reply('Bu komutu sadece bot sahibi kullanabilir!');
    }
    
    const code = args.join(' ');
    
    try {
      const evaled = eval(code);
      const cleaned = inspect(evaled, { depth: 0 });
      
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Eval Başarılı')
        .addFields(
          { name: '📥 Girdi', value: `\`\`\`js\n${code}\n\`\`\`` },
          { name: '📤 Çıktı', value: `\`\`\`js\n${cleaned.length > 1000 ? cleaned.slice(0, 1000) + '...' : cleaned}\n\`\`\`` },
          { name: '⌛ Tür', value: `\`\`\`js\n${typeof evaled}\n\`\`\`` }
        )
        .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Eval Başarısız')
        .addFields(
          { name: '📥 Girdi', value: `\`\`\`js\n${code}\n\`\`\`` },
          { name: '❌ Hata', value: `\`\`\`js\n${error}\n\`\`\`` }
        )
        .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      message.channel.send({ embeds: [embed] });
    }
  },
};
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'yardım',
  aliases: ['help', 'komutlar'],
  description: 'Tüm komutları listeler veya belirli bir komut hakkında bilgi verir.',
  usage: '[komut adı]',
  cooldown: 5,
  execute(message, args, client) {
    const { commands } = message.client;
    const data = [];
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({ name: `${client.user.username} Yardım Menüsü`, iconURL: client.user.displayAvatarURL() })
      .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    if (!args.length) {
      const categories = new Map();
      
      commands.forEach(command => {
        const category = command.category || 'Diğer';
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        categories.get(category).push(`\`${command.name}\``);
      });
      
      categories.forEach((cmds, category) => {
        embed.addFields({ name: `__${category}__`, value: cmds.join(', ') });
      });
      
      embed.setDescription(`Komut hakkında daha fazla bilgi için \`${client.config.prefix}yardım [komut adı]\` yazın.`);
      
      return message.channel.send({ embeds: [embed] });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply('Bu bir geçerli komut değil!');
    }

    embed.setTitle(`Komut: ${command.name}`);

    if (command.aliases) embed.addFields({ name: 'Alternatifler', value: command.aliases.join(', ') });
    if (command.description) embed.addFields({ name: 'Açıklama', value: command.description });
    if (command.usage) embed.addFields({ name: 'Kullanım', value: `${client.config.prefix}${command.name} ${command.usage}` });
    if (command.cooldown) embed.addFields({ name: 'Bekleme Süresi', value: `${command.cooldown || 3} saniye` });

    message.channel.send({ embeds: [embed] });
  },
};
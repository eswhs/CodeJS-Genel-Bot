const { Collection } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  execute(message, client) {
    if (message.author.bot) return;
    if (!message.content.startsWith(client.config.prefix)) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'DM') {
      return message.reply('Bu komutu özel mesajlarda kullanamam!');
    }

    if (command.permissions) {
      if (message.channel.type !== 'DM') {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
          return message.reply('Bu komutu kullanma izniniz yok!');
        }
      }
    }

    if (command.args && !args.length) {
      let reply = `Eksik argüman, ${message.author}!`;
      
      if (command.usage) {
        reply += `\nDoğru kullanım: \`${client.config.prefix}${command.name} ${command.usage}\``;
      }
      
      return message.reply(reply);
    }

    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Collection());
    }
    
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || client.config.defaultCooldown) * 1000;
    
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Lütfen \`${command.name}\` komutunu kullanmadan önce ${timeLeft.toFixed(1)} saniye bekleyin.`);
      }
    }
    
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('Komutu çalıştırırken bir hata oluştu!');
    }
  }
};

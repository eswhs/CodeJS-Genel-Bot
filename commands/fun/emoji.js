module.exports = {
    name: 'emoji',
    description: 'Sunucudaki emojileri gösterir',
    guildOnly: true,
    category: 'Genel',
    execute(message) {
      const emojis = message.guild.emojis.cache;
      
      if (emojis.size === 0) {
        return message.reply('Bu sunucuda hiç emoji yok!');
      }
      
      const emojiList = emojis.map(emoji => `${emoji} - \`:${emoji.name}:\``).join('\n');
      
      const chunks = [];
      for (let i = 0; i < emojiList.length; i += 2000) {
        chunks.push(emojiList.substring(i, i + 2000));
      }
      
      chunks.forEach((chunk, index) => {
        message.channel.send(`**Emoji Listesi (${index + 1}/${chunks.length}):**\n${chunk}`);
      });
    },
  };
  
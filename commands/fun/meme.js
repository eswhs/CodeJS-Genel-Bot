const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  name: 'meme',
  description: 'Rastgele bir meme gösterir',
  cooldown: 5,
  category: 'Eğlence',
  async execute(message) {
    try {
      const response = await axios.get('https://meme-api.com/gimme');
      const { title, url, subreddit } = response.data;
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(title)
        .setURL(url)
        .setImage(url)
        .setFooter({ text: `r/${subreddit} | ${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() });
      
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('Meme getirirken bir hata oluştu!');
    }
  },
};
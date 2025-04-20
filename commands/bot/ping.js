module.exports = {
    name: 'ping',
    description: 'Bot gecikmesini gösterir',
    cooldown: 5,
    execute(message) {
      message.reply(`🏓 Pong! Gecikme: ${message.client.ws.ping}ms`);
    },
  };
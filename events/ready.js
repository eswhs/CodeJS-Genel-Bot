module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      console.log(`Bot hazır! ${client.user.tag} olarak giriş yapıldı!`);
      client.user.setActivity('!yardım | Advanced Bot', { type: 'PLAYING' });
    }
  };
  
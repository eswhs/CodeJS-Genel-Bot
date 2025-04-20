module.exports = {
    name: 'temizle',
    aliases: ['clear', 'sil'],
    description: 'Belirtilen sayıda mesajı siler',
    guildOnly: true,
    permissions: 'MANAGE_MESSAGES',
    args: true,
    usage: '<sayı>',
    category: 'Moderasyon',
    execute(message, args) {
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        return message.reply('Bu komutu kullanma yetkiniz yok!');
      }
  
      const amount = parseInt(args[0]);
      
      if (isNaN(amount)) {
        return message.reply('Lütfen geçerli bir sayı girin!');
      }
      
      if (amount < 1 || amount > 100) {
        return message.reply('Lütfen 1 ile 100 arasında bir sayı girin!');
      }
      
      message.channel.bulkDelete(amount + 1, true)
        .then(deleted => {
          message.channel.send(`${deleted.size - 1} mesaj silindi!`)
            .then(msg => {
              setTimeout(() => msg.delete(), 3000);
            });
        })
        .catch(error => {
          console.error(error);
          message.reply('Mesajları silerken bir hata oluştu!');
        });
    },
  };
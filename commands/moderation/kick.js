module.exports = {
    name: 'kick',
    description: 'Belirtilen kullanıcıyı sunucudan atar',
    guildOnly: true,
    permissions: 'KICK_MEMBERS',
    args: true,
    usage: '<kullanıcı> [sebep]',
    category: 'Moderasyon',
    execute(message, args) {
      if (!message.member.permissions.has('KICK_MEMBERS')) {
        return message.reply('Bu komutu kullanma yetkiniz yok!');
      }
  
      const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!target) {
        return message.reply('Lütfen atılacak bir kullanıcı belirtin!');
      }
      
      if (!target.kickable) {
        return message.reply('Bu kullanıcıyı atamam!');
      }
      
      const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';
      
      target.kick(reason)
        .then(() => {
          message.reply(`**${target.user.tag}** başarıyla atıldı. Sebep: ${reason}`);
        })
        .catch(error => {
          console.error(error);
          message.reply('Kullanıcıyı atarken bir hata oluştu!');
        });
    },
  };
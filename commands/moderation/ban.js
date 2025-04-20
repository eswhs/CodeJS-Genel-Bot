module.exports = {
    name: 'ban',
    description: 'Belirtilen kullanıcıyı sunucudan yasaklar',
    guildOnly: true,
    permissions: 'BAN_MEMBERS',
    args: true,
    usage: '<kullanıcı> [sebep]',
    category: 'Moderasyon',
    execute(message, args) {
      if (!message.member.permissions.has('BAN_MEMBERS')) {
        return message.reply('Bu komutu kullanma yetkiniz yok!');
      }
  
      const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!target) {
        return message.reply('Lütfen yasaklanacak bir kullanıcı belirtin!');
      }
      
      if (!target.bannable) {
        return message.reply('Bu kullanıcıyı yasaklayamam!');
      }
      
      const reason = args.slice(1).join(' ') || 'Sebep belirtilmedi';
      
      target.ban({ reason })
        .then(() => {
          message.reply(`**${target.user.tag}** başarıyla yasaklandı. Sebep: ${reason}`);
        })
        .catch(error => {
          console.error(error);
          message.reply('Kullanıcıyı yasaklarken bir hata oluştu!');
        });
    },
  };
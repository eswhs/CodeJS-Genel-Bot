const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'mute',
  aliases: ['sustur', 'timeout'],
  description: 'Belirtilen kullanıcıyı susturur',
  guildOnly: true,
  permissions: 'MODERATE_MEMBERS',
  args: true,
  usage: '<kullanıcı> <süre> [sebep]',
  category: 'Moderasyon',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('Bu komutu kullanma yetkiniz yok!');
    }

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) {
      return message.reply('Lütfen susturulacak bir kullanıcı belirtin!');
    }

    if (target.roles.highest.position >= message.member.roles.highest.position) {
      return message.reply('Bu kullanıcıyı susturamam çünkü sizinle aynı veya daha yüksek bir role sahip!');
    }

    if (target.id === message.client.user.id) {
      return message.reply('Kendimi susturamam!');
    }

    if (target.id === message.guild.ownerId) {
      return message.reply('Sunucu sahibini susturamam!');
    }

    if (!args[1]) {
      return message.reply('Lütfen bir süre belirtin! (Örn: 1s, 1m, 1h, 1d)');
    }

    const time = args[1];
    let duration;
    
    try {
      duration = ms(time);
    } catch (error) {
      return message.reply('Geçersiz süre formatı! Örnek: 1s, 5m, 2h, 1d');
    }

    if (!duration || duration < 5000 || duration > 2419200000) {
      return message.reply('Süre en az 5 saniye, en fazla 28 gün olmalıdır!');
    }

    const reason = args.slice(2).join(' ') || 'Sebep belirtilmedi';
    
    try {
      await target.timeout(duration, reason);

      const muteEmbed = new EmbedBuilder()
        .setColor('#ff9900')
        .setTitle('Kullanıcı Susturuldu')
        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: '👤 Susturulan Kullanıcı', value: `${target.user.tag} (${target.id})`, inline: false },
          { name: '🕒 Süre', value: time, inline: true },
          { name: '👮 Yetkili', value: message.author.tag, inline: true },
          { name: '📝 Sebep', value: reason, inline: false }
        )
        .setFooter({ text: `${message.author.tag} tarafından`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();
      
      message.channel.send({ embeds: [muteEmbed] });

      try {
        const dmEmbed = new EmbedBuilder()
          .setColor('#ff9900')
          .setTitle(`${message.guild.name} sunucusunda susturuldunuz!`)
          .addFields(
            { name: '🕒 Süre', value: time, inline: true },
            { name: '👮 Yetkili', value: message.author.tag, inline: true },
            { name: '📝 Sebep', value: reason, inline: false }
          )
          .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
          .setTimestamp();
          
        await target.send({ embeds: [dmEmbed] });
      } catch (err) {
        console.log(`${target.user.tag} kullanıcısına DM gönderilemedi.`);
      }
      
    } catch (error) {
      console.error('Mute hatası:', error);
      return message.reply('Kullanıcı susturulurken bir hata oluştu! Botun yetkileri yetersiz olabilir.');
    }
  },
};
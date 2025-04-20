module.exports = {
    name: '8ball',
    description: 'Sihirli 8ball bir soru sorun',
    aliases: ['8top', 'sihirlitop'],
    usage: '<soru>',
    args: true,
    category: 'Eğlence',
    execute(message, args) {
      const question = args.join(' ');
      const responses = [
        'Kesinlikle evet.', 'Kesin öyle.', 'Şüphesiz.', 'Evet, kesinlikle.',
        'Buna güvenebilirsin.', 'Gördüğüm kadarıyla, evet.', 'Büyük ihtimalle.',
        'Görünüm iyi.', 'Evet.', 'İşaretler eveti gösteriyor.',
        'Belirsiz, tekrar dene.', 'Sonra tekrar sor.', 'Şimdi söylemesem daha iyi.',
        'Şimdi tahmin edemiyorum.', 'Konsantre ol ve tekrar sor.',
        'Buna güvenme.', 'Cevabım hayır.', 'Kaynaklarım hayır diyor.',
        'Görünüm pek iyi değil.', 'Çok şüpheli.'
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      message.reply(`🎱 Soru: ${question}\n**${response}**`);
    },
  };
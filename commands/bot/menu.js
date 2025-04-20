// File: commands/bot/menu.js
const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require('discord.js');

module.exports = {
  name: 'menü',
  aliases: ['menu', 'yardımmenü'],
  description: 'Etkileşimli komut menüsünü gösterir',
  cooldown: 10,
  category: 'Bot',
  async execute(message, args, client) {
    const categories = [
      { name: 'Bot', value: 'bot', emoji: '🤖', description: 'Bot hakkında komutlar' },
      { name: 'Moderasyon', value: 'moderasyon', emoji: '🛡️', description: 'Sunucu yönetim komutları' },
      { name: 'Genel', value: 'genel', emoji: '📝', description: 'Genel kullanım komutları' },
      { name: 'Eğlence', value: 'eğlence', emoji: '🎮', description: 'Eğlence komutları' },
      { name: 'Admin', value: 'admin', emoji: '⚙️', description: 'Sadece yöneticiler için komutlar' }
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help_category')
      .setPlaceholder('Komut kategorisi seçin')
      .addOptions(categories.map(category => ({
        label: category.name,
        value: category.value,
        emoji: category.emoji,
        description: category.description
      })));

    const selectRow = new ActionRowBuilder().addComponents(selectMenu);
    
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('help_prev').setLabel('Önceki').setStyle(ButtonStyle.Primary).setEmoji('⬅️').setDisabled(true),
      new ButtonBuilder().setCustomId('help_home').setLabel('Ana Sayfa').setStyle(ButtonStyle.Secondary).setEmoji('🏠'),
      new ButtonBuilder().setCustomId('help_next').setLabel('Sonraki').setStyle(ButtonStyle.Primary).setEmoji('➡️').setDisabled(true)
    );

    const mainEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${client.user.username} - Komut Yardım Menüsü`)
      .setDescription('Aşağıdaki menüden bir kategori seçerek komutları görüntüleyebilirsiniz.')
      .addFields(categories.map(cat => ({ name: `${cat.emoji} ${cat.name}`, value: cat.description, inline: true })))
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: `${message.author.tag} tarafından istendi`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    const helpMessage = await message.channel.send({ embeds: [mainEmbed], components: [selectRow, buttonRow] });

    const filter = i => i.user.id === message.author.id;
    const collector = helpMessage.createMessageComponentCollector({ filter, idle: 60000, componentType: ComponentType.StringSelect });
    const buttonCollector = helpMessage.createMessageComponentCollector({ filter, idle: 60000, componentType: ComponentType.Button });

    let currentCategory = null;
    let currentPage = 0;
    let totalPages = 0;
    let categoryCommands = [];

    const updateEmbed = (category, page = 0) => {
      const commands = client.commands.filter(cmd => cmd.category?.toLowerCase() === category.toLowerCase());
      categoryCommands = [...commands.values()];
      totalPages = Math.ceil(categoryCommands.length / 5);
      currentPage = page;
      const selectedCat = categories.find(cat => cat.value === category);
      const pageCommands = categoryCommands.slice(page * 5, (page * 5) + 5);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`${selectedCat.emoji} ${selectedCat.name} Komutları`)
        .setDescription(`${selectedCat.description}\n\nSayfa ${currentPage + 1}/${totalPages || 1}`)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter({ text: `${message.author.tag} | Kategori değiştirmek için aşağıdaki menüyü kullanın`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      if (pageCommands.length > 0) {
        pageCommands.forEach(cmd => {
          embed.addFields({
            name: `\`${client.config.prefix}${cmd.name}\` ${cmd.aliases ? `(${cmd.aliases.join(', ')})` : ''}`,
            value: `${cmd.description || 'Açıklama yok'}${cmd.usage ? `\nKullanım: \`${client.config.prefix}${cmd.name} ${cmd.usage}\`` : ''}`
          });
        });
      } else {
        embed.addFields({ name: 'Komut Bulunamadı', value: 'Bu kategoride komut bulunmuyor.' });
      }

      return embed;
    };

    const updateButtons = (page, totalPages) => {
      const buttons = buttonRow.components;
      buttons[0].setDisabled(page === 0);
      buttons[2].setDisabled(page >= totalPages - 1 || totalPages <= 1);
      return buttonRow;
    };

    collector.on('collect', async interaction => {
      const selectedCategory = interaction.values[0];
      currentCategory = selectedCategory;
      const categoryEmbed = updateEmbed(selectedCategory);
      const updatedButtons = updateButtons(0, totalPages);
      await interaction.update({ embeds: [categoryEmbed], components: [selectRow, updatedButtons] });
    });

    buttonCollector.on('collect', async interaction => {
      const { customId } = interaction;

      if (customId === 'help_home') {
        currentCategory = null;
        await interaction.update({ embeds: [mainEmbed], components: [selectRow, buttonRow] });
        return;
      }

      if (!currentCategory) return;

      if (customId === 'help_prev') {
        currentPage = Math.max(0, currentPage - 1);
      } else if (customId === 'help_next') {
        currentPage = Math.min(totalPages - 1, currentPage + 1);
      }

      const categoryEmbed = updateEmbed(currentCategory, currentPage);
      const updatedButtons = updateButtons(currentPage, totalPages);
      await interaction.update({ embeds: [categoryEmbed], components: [selectRow, updatedButtons] });
    });

    collector.on('end', async () => {
      const embed = helpMessage.embeds[0];
      try {
        await helpMessage.edit({
          embeds: [EmbedBuilder.from(embed).setFooter({ text: 'Bu menü artık aktif değil.', iconURL: client.user.displayAvatarURL() })],
          components: []
        });
      } catch (error) {
        if (error.code === 10008) {
          console.log("Mesaj bulunamadı, silinmiş olabilir.");
        } else {
          console.error('Mesaj düzenlenemedi:', error);
        }
      }
    });
  },
};

const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const { getReply } = require('../../../../utils/utils')
const { MessageEmbed } = require('discord.js')
// Change DIR if needed

module.exports = {
    name: "comment",
    aliases: ['com'],
    description: "Make a comment to given post",
    usage: `\`${PREFIX}comment [post-id]\``,
    examples: `\`${PREFIX}comment 822214720613384244\``,
    cooldown: 5,

    execute: async function(client, message, args) {
      let postId = args[0];
      if (!postId) return message.reply('Please enter a valid Id to comment')
      
      let DBPost = await client.DBPost.findById(postId)
      if(!DBPost) return message.reply(`Could not Fetch a post with the id ${postId.content}`)

      message.reply("what should be the content of the comment? if you don't want to comment no more just write `cancel`");
      let text = await getReply(message, { time: 120000 });
      if (!text) return message.channel.send(`${message.author.tag}, times up! Try again.`);
      if (text.content.length > 150) return message.reply('Your description cannot go above 150 characters')
      if(text.content.toLowerCase() == 'cancel') return message.reply('Cancelled')

      await client.DBComments({
        _id: text.id,
        postId,
        author: text.author.id,
        text: text.content
      }).save()

      const comEmbed = new MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
      .setTitle(`New comment for ${postId}`)
      .setDescription(text.content)
      .setFooter(`Author <@${message.author.id}>`)
      .setColor("RANDOM")

      client.users.cache.get(DBPost.author).send(comEmbed)
      message.reply('You made a comment, good job cheems!')
    }
}
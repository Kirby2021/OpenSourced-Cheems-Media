const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const {MessageEmbed} = require('discord.js')
// Change DIR if needed

module.exports = {
    name: "showall",
    description: "Shows the all comments for post",
    usage: `\`${PREFIX}showall [post-id]\``,
    examples: `\`${PREFIX}showall 822214720613384244\``,
    cooldown: 5,

    execute: async function(client, message, args) {
      let postId = args[0];
      if (!postId) return message.reply('Please enter a valid Id to comment')
      
      let DBPost = await client.DBPost.findById(postId)
      if(!DBPost) return message.reply(`Could not Fetch a post with the id ${postId.content}`)

      const result = await client.DBComments.find({postId})
      if (!result) return message.reply('Sory there is no comment on this post')
      embed(result, DBPost, message, client)
    }
}

function embed(list, post, message, client){
  var author = client.users.cache.get(post.author)
  const x = new MessageEmbed()
  .setTitle(`Comments for ${post.title} Author ${author.username}`)
  .setColor("RANDOM")
  for(var i = 0; i < list.length; i++){
    var author = client.users.cache.get(list[i].author)
    x.addField(`${author.username}`, list[i].text)
    if (i == 24){
      for (var y = 0; y < 25; i++){
        list.shift()
      }
      embed(list, post, message, client)
    }
  }
  message.channel.send(x)
}
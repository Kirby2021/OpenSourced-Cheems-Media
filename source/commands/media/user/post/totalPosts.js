const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const { MessageEmbed } = require('discord.js')
// Change DIR if needed

module.exports = {
    name: "totalposts",
    aliases: ["tps", "totalpost"],
    description: "Look at a users post!",
    usage: `\`${PREFIX}\``,
    examples: `\`${PREFIX}\``,
    perms: [],
    cooldown: 6,

    execute: async function (client, message, args) {
        let DBAuthor = await client.DBUser.findById(message.author.id);
        if (!DBAuthor) return message.reply('Please use the Signup command!')

       let user = client.users.cache.get(args[0]) || message.mentions.users.first();
        if (!user) user = message.author;

        // Look for User in the database
        let DBUser = await client.DBUser.findById(user.id);
        if (!DBUser) return message.reply('Please use the Signup command!')
        if (!DBUser) {
            const fetch = await client.DBUser.findById(user.id);
            DBUser = {}
            DBUser['_id'] = fetch._id
            DBUser['posts'] = fetch.posts
        }

        let posts = await client.DBPost.find({author: user.id})
            if(!posts) return message.reply('You haven\'t created an post!')
        
                    
            const hEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()

                const generateEmbed = start => {
                    const current = posts.slice(start, start + 15)
                    hEmbed.setTitle(`Showing ${user.tag}'s posts ${start + 1}-${start + current.length} out of ${posts.length}`)
                    current.forEach(post => hEmbed.addField(`📝${post.title}`, `**ID:** ${post.id}`))
                    return hEmbed
                  }
                  
           const msg = await message.channel.send(generateEmbed(0))
           if(posts.length <= 15) return
           msg.react('➡️')
           const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id
           const collector = msg.createReactionCollector(filter, {time: 60000})
           let currrentIndex = 0;
           collector.on('collect', async reaction => {
               msg.reactions.removeAll().then(async() => {
                   reaction.emoji.name === '⬅️' ? currrentIndex -= 15 : currrentIndex += 15                   
               msg.edit(generateEmbed(currrentIndex))
               if(currrentIndex !== 0) await msg.react('⬅️')
               if(currrentIndex + 15 < posts.length) msg.react('➡️')
               })
           })
           collector.on('end', async reaction => {
               msg.reactions.removeAll()
           })
    }
}
const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const {MessageEmbed} = require('discord.js')
// Change DIR if needed

module.exports = {
    name: "report",
    description: "report the given post",
    usage: `\`${PREFIX}report [post-id] [report-message]\``,
    cooldown: 20,

    execute: async function(client, message, args) {
        if(!args[0]) return message.reply('You should enter post id to report')
        if(!args[1]) return message.reply('You should enter reason to report')
        var post = await client.DBPost.findById(args[0])
        if(!post) return message.reply('Please enter a valid id')

        args.shift()
        var reason = args.join(' ')

        const embed = new MessageEmbed()
        .setTitle(post.title)
        .setDescription(post.description)
        .setColor("RANDOM")
        .addField('Reason', reason)
        .setFooter(`Post id ${post.id} | Author id ${post.author} | Reported by ${message.author.id}`)
        if (post.image.toLowerCase() !== 'none') embed.setImage(post.image)

        message.reply(`Post reported`)
        
        var admin = await client.DBStaff.find({job: 'admin'})
        admin = admin.random()

        var channel = client.channels.cache.get('829467888951623701')
        channel.send(`<@${admin._id}>`)
        channel.send(embed)
    }
}

const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const { getReply, DMfeed, ChannelFeed, staffFeed } = require('../../../../utils/utils')
const {MessageEmbed} = require('discord.js')
const isNsfw = require('../../../../utils/nsfw')
// Change DIR if needed

module.exports = {
    name: "post",
    description: "creates new post ",
    usage: `\`${PREFIX}post\``,
    cooldown: 20,

    execute: async function(client, message) {
        let DBUser = await client.DBUser.findById(message.author.id);
        if (!DBUser) return message.reply('You must signup using the signup command!');

        message.channel.send(`${message.author.tag}, what should be the title of the post? **You can type \`cancel\` any time to stop it**`);
        let title = await getReply(message, { time: 60000 });
        if (!title) return message.channel.send(`${message.author.tag}, times up! Try again.`);
        if (title.content.length > 75) return message.reply('Your title cannot go above 75 characters')
        if(title.content.toLowerCase() == 'cancel') return message.reply('Cancelled')
        message.channel.send(`${message.author.tag}, what should be the description of the post?`);
        let description = await getReply(message, { time: 120000 });
        if (!description) return message.channel.send(`${message.author.tag}, times up! Try again.`);
        if (description.content.length > 150) return message.reply('Your description cannot go above 150 characters')
        if(description.content.toLowerCase() == 'cancel') return message.reply('Cancelled')
        message.channel.send(`${message.author.tag}, if you want to add a image send it! if not respond with **none**`);
        let image = await getReply(message, { time: 60000, type: 'image' });
        let regex = (/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/?)\/.+[a-z]/g)
        if(image.content.toLowerCase() == 'cancel') return message.reply('Cancelled')
        if(image.attachments.size > 0)  image = image.attachments.first().url
        else if(image.content.toLowerCase() != 'none' && !image.content.toLowerCase().includes(regex.test(image.content))) return message.reply('You message does not include none or a image link!')

        var n = false
        if(image) n = await isNsfw(image)
        let post = {
            _id: message.id,
            author: message.author.id,
            title: title.content,
            description: description.content,
            image: image.content || image,
            checked: n
        }

        await client.DBUser.findByIdAndUpdate(message.author.id, { $push: { posts: post._id } }, { new: true, upsert: true });
        await client.DBPost.findByIdAndUpdate(message.id, { $set: post }, { new: true, upsert: true })
        try {
        message.reply(` Good job Cheems!! your post has been uploaded! `)
        } catch(err) {
            console.log(err)
            message.reply(`Error!\nPlease Contact an Admin about this`)
        }
       const feedEmbed = new MessageEmbed()
        .setAuthor(message.author.tag)
        .setTitle(title)
        .setDescription(description)
        .setColor("RANDOM")
        if(post.image.toLowerCase() != 'none') feedEmbed.setImage(image)
        // This will DM a Follower if the User Posted a message!

        DMfeed(message.author.id, title.content, description.content, post.image.toLowerCase(), message.client)

        //this will send a message to feed channels
        ChannelFeed(message.author.id, message.client, feedEmbed)
        //this will send all posts to a Cheems media channel to check if the message is allowed
        staffFeed(message.author.id, title.content, description.content, post.image.toLowerCase(), message.client, post._id)
    }
}

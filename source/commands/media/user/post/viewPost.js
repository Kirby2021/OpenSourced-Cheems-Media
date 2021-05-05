const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const { getReply } = require('../../../../utils/utils');
const { MessageEmbed } = require('discord.js');
// Change DIR if needed

module.exports = {
    name: "viewpost",
    aliases: ["vp", "viewp"],
    description: "shows the post with given id",
    usage: `\`${PREFIX}viewpost [post-id]\``,
    examples: `\`${PREFIX}viewpost 821782566260178984\``,
    cooldown: 5,

    execute: async function(client, message, args) {
    let DBUser = await client.DBUser.findById(message.author.id);
    if (!DBUser) return message.reply('You must signup using the signup command!');

      let postID = args.splice(0).join(' ');
      if(!postID) return message.reply('You need to give a ID!');

        // return console.log(post)
        //const user = await client.users.fetch(post.author);
        let DBPost = await client.DBPost.findById(postID);
        if(!DBPost) return message.reply('I Could not find a post!')
        if(DBPost.checked && !message.channel.nsfw) return message.reply("This is a NSFW post, you can't see NSFW posts at SFW channels")

        var cheems = 0
        if(DBPost.cheems != null || DBPost.cheems != undefined) cheems = DBPost.cheems
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(DBPost.title)
        .setDescription(DBPost.description)
        .setFooter(`Post author: ${DBPost.author} | Post id: ${DBPost._id} | Cheems: ${cheems}`);

        if (DBPost.image.toLowerCase() !== 'none') embed.setImage(DBPost.image);

        message.channel.send(embed)

        let reply = await getReply(message, { time: 30000 })
        if (!reply) return;
        if (reply.content.toLowerCase() === '!up') {
          if(DBPost.cheemGivers.includes(message.author.id)) return message.reply('You have already given Cheems to this post');
            await client.DBPost.findByIdAndUpdate(DBPost._id, { $inc: { upvotes: 1 } }, { new: true, upsert: true });
            await client.DBUser.findByIdAndUpdate(DBPost.author, { $inc: { cheems: 1 } }, { new: true, upsert: true });
            await client.DBPost.findByIdAndUpdate(DBPost._id, { $push: { cheemGivers: message.author.id } }, { new: true, upsert: true});
            message.reply('Cheems Given! 😊')
        }
        else if (reply.content.toLowerCase() === '!down') {
          if(DBPost.cheemTakers.includes(message.author.id)) return message.reply('You have already taken Cheems to this post');
            await client.DBPost.findByIdAndUpdate(postID, { $inc: { downvotes: 1 } }, { new: true, upsert: true });
            await client.DBUser.findByIdAndUpdate(post.author, { $inc: { cheems: -1 } }, { new: true, upsert: true });
            await client.DBPost.findByIdAndUpdate(DBPost._id, { $pull: { cheemTakers: message.author.id } }, { new: true, upsert: true});
            message.reply('Cheems Taken! 😢')
        }
    }
}

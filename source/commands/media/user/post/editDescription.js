const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const { getReply, DMfeed, ChannelFeed } = require('../../../../utils/utils')
// Change DIR if needed

module.exports = {
    name: "editdescription",
    description: "you can change the description of post",
    usage: `\`${PREFIX}editdescription\``,
    examples: `\`${PREFIX}editdescription\``,
    cooldown: 20,

    execute: async function(client, message, args) {
        let DBUser = await client.DBUser.findById(message.author.id);
        if (!DBUser) return message.reply('You must signup using the signup command!');
       
        message.channel.send(`${message.author.tag}, What is the posts id??`);

        let postID = await getReply(message, { time: 60000 });
        if (!postID) return message.channel.send(`${message.author.tag}, times up! Try again.`);

        let DBPost = await client.DBPost.findById(postID.content)
        if(!DBPost) return message.reply('Give me an valid id!')
        if(DBPost.author != message.author.id) return message.reply('You are not the author of this post')
       
        message.channel.send(`${message.author.tag}, What should be the new description of the post be?`);
        let description = await getReply(message, { time: 120000 });
        if (description.content.length > 100) return message.reply('Your description cannot go above 150 characters')
        if (!description) return message.channel.send(`${message.author.tag}, times up! Try again.`);


          try{
            await client.DBPost.findByIdAndUpdate(postID.content, { $set: { description: description.content } }, { new: true, upsert: true });
            message.reply(`POST ${postID.content} Description is now set to\n ${description.content}`)
          } catch(err) {

          }
    }
}
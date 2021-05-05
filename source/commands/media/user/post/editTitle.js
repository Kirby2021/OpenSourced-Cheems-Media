const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const { getReply } = require('../../../../utils/utils')
// Change DIR if needed

module.exports = {
    name: "edittitle",
    description: "edit the title of given post",
    usage: `\`${PREFIX}edittitle [post-id]\``,
    examples: `\`${PREFIX}edittitle 821782566260178984\``,
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
       
        message.channel.send(`${message.author.tag}, What should the new Title be??`);
        let title = await getReply(message, { time: 120000 });
        if (title.content.length > 75) return message.reply('Your title cannot go above 75 characters')
        if (!title) return message.channel.send(`${message.author.tag}, times up! Try again.`);


          try{
            await client.DBPost.findByIdAndUpdate(postID.content, { $set: { title: title.content } }, { new: true, upsert: true });
            message.reply(`POST ${postID.content} Description is now set to\n ${title.content}`)
          } catch(err) {
            console.log(err)
          }
    }
}
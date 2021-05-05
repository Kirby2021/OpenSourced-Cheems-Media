const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
// Change DIR if needed

module.exports = {
    name: "favorite",
    description: "adds post with the given id to your favs",
    usage: `\`${PREFIX}favorite [post-id]\``,
    examples: `\`${PREFIX}favorite 387189529548816384\``,
    cooldown: 10,

    execute: async function(client, message, args) {
        let DBAuthor = await client.DBUser.findById(message.author.id);
        if (!DBAuthor) return message.reply('You must signup using the signup command!');

        let messageId = args.splice(0).join(' ')
        if(!messageId) return message.reply('You need to give me a post ID!')

         let DBPost = await client.DBPost.findById(messageId)
         if (messageId !== DBPost._id) return message.reply('That is not a vaild post id!')

        try{
            await client.DBUser.findByIdAndUpdate(message.author.id, { $push: { favourites: messageId} }, { new: true, upsert: true });
            message.channel.send(`POST ID: ${messageId} has been added to ${message.author.tag}'s Favorite list!`)
        }catch(err){

        }
    }
}
const { PREFIX } = require('../../../config/botconfig.json').PREFIX;
// Change DIR if needed

module.exports = {
    name: "check",
    description: "Sets the post as NSFW",
    usage: `\`${PREFIX}check [post-ID]\``,
    examples: `\`${PREFIX}check 823610619131461643\``,
    adminOnly: true,
    someServersOnly: true,

    execute: async function(client, message, args) {

        let postID = args[0]
        if (!postID) return message.reply('Give me a postID!!');
        let DBPost = await client.DBPost.findById(postID);
        if (!DBPost) return message.reply('Could not find a post with that ID!')
        
        try{
            if(DBPost.checked == true) return message.reply('This post has already been checked')
            await client.DBPost.findByIdAndUpdate(postID, { $set: { checked: true  } }, { new: true, upsert: true });
            message.channel.send(`${postID} has been checked by ${message.author.id}`)
        }catch(err) {
            console.log(err)
        }
    }
}
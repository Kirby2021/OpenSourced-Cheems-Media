const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const { getReply } = require('../../../../utils/utils')
// Change DIR if needed

module.exports = {
    name: "upvote",
    description: "you can upvote the post",
    usage: `\`${PREFIX}upvote [post-id]\``,
    examples: `\`${PREFIX}upvote 822220305644388362\``,
    cooldown: 5,

    execute: async function(client, message, args) {
      let postID = args[0];
      if (!postID) {
      message.channel.send('Please send me the ID');
      const reply = await getReply(message, { time: 30000});
      if (reply && reply.content) postID = reply.content;
      else return message.channel.send('I need a valid ID')
      }

      let DBPost = await client.DBPost.findById(postID)
      if(!DBPost) return(`Could not Fetch a post with the id ${postID}`)
      if(DBPost.cheemGivers.includes(message.author.id)) return message.reply('You have already gave Cheems to this post');
      if(DBPost.cheemTakers.includes(message.author.id)) { 
        await client.DBPost.findByIdAndUpdate(DBPost._id, { $pull: { cheemTakers: message.author.id }, $inc: { cheems: 1 }, $push: { cheemGivers: message.author.id } }, { new: true, upsert: true}); 
      } else {
        await client.DBPost.findByIdAndUpdate(DBPost._id, { $inc: { cheems: 1 }, $push: { cheemGivers: message.author.id } }, { new: true, upsert: true });
      }
      await client.DBUser.findByIdAndUpdate(DBPost.author, { $inc: { cheems: 1 } }, { new: true, upsert: true });
      message.reply('Cheems Given! 😊')
    }
}

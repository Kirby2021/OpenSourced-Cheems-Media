const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const getReply = require('../../../../utils/utils');
const { MessageEmbed } = require('discord.js');
// Change DIR if needed

module.exports = {
    name: "deletepost",
    aliases: ["dp", "deletep"],
    description: "Delete the post of yours",
    usage: `\`${PREFIX}deletepost [post-id]\``,
    examples: `\`${PREFIX}deletepost 821782566260178984\``,
    cooldown: 20,

    execute: async function(client, message, args) {
    let DBUser = await client.DBUser.findById(message.author.id);
    if (!DBUser) return message.reply('You must signup using the signup command!');


      let postID = args.splice(0).join(' ');
      if(!postID) return message.reply('You need to give a ID!');

      let DBPost = await client.DBPost.findById(postID);
      if(message.author.id !== DBPost.author) return message.reply('You are not the author of this post!')
          
        try {
            await client.DBPost.findByIdAndDelete(postID, { posts: DBPost._id });
              message.reply(`Post ${postID} has been deleted!`)
              console.log(chalk.red(`<${client.user.tag}>`) + (' ') + chalk.blue(`Post ID: ${postID} was deleted by `))
          } catch(err) {
            message.reply(`Error!\nPlease Contact an Admin about this`)
          }
    }
}
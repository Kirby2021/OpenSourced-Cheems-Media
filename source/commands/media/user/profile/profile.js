const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const { MessageEmbed } = require('discord.js')
// Change DIR if needed

module.exports = {
  name: "profile",
  aliases: ["profil"],
  usage: `\`${PREFIX}profile\``,
  cooldown: 20,

  execute: async function (client, message, args) {
    let DBAuthor = await client.DBUser.findById(message.author.id);
    if (!DBAuthor) return message.reply('Please sign up using the signup command')
    let user = client.users.cache.get(args[0]) || message.mentions.users.first();
    if (!user) user = message.author

    let DBUser = await client.DBUser.findById(user.id);
    if (!DBUser) return message.reply(`We Cannot find a user with the ID ${user.id}`)
    let dmOpted = 'Enabled'
    if(!DBUser.dmOpt)  dmOpted = 'Disabled'
    let Verified = `${user.tag}`
    if(DBUser.verified) Verified = `${user.username} <:CheemVerifed:813221989544230913>`

    const profile = new MessageEmbed()
      .setTitle(Verified)
      .addFields(
        { name: "Profile Bio", value: DBUser.bio || 'No Bio', inline: false },
        { name: "Total Posts:", value: DBUser.posts.length || 'None', inline: true },
        { name: "Total Cheems", value: DBUser.cheems || '0', inline: true },
        { name: "DM Status:", value: dmOpted || 'Unknown', inline: true },
        { name: "Total Followers", value: DBUser.followers.length || 'None', inline: true },
        { name: "Total Follows", value: DBUser.follows.length || '0', inline: true },
        { name: "Join Date", value: DBUser.joindate || 'Unknown', inline: false },
        // { name: "Following", value: follows || 'None', inline: false },
      )
      .setColor(DBUser.color)
      .setThumbnail(user.displayAvatarURL())
      .setFooter(`User ID: ${DBUser._id}`)
    try {
      message.channel.send(profile)
    } catch (err) {
      console.log(err)
      message.reply(`Error!\nPlease Contact an Admin about this`)
    }
  }
}
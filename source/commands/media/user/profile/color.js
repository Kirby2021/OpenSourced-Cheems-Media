const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
// Change DIR if needed

module.exports = {
  name: "setcolor",
  description: "changes the color of your profile",
  usage: `\`${PREFIX}setcolor [hex-color]\``,
  examples: `\`${PREFIX}setcolor #00CD00\``,
  cooldown: 20,

  execute: async function (client, message, args) {
    let DBUser = await client.DBUser.findById(message.author.id);
    if (!DBUser) return message.reply('You must signup using the signup command!')

    let color = args.join(' ');
    if (!color) return message.reply('Give me a color!!');
    //  if(color !== /^#([0-9A-F]{3}){1,2}$/i) return message.reply('Give me a Hex!') */ 
    if (/^#(?:[0-9a-fA-F]{3}){1,2}$/g.test(color)) {
      await client.DBUser.findByIdAndUpdate(message.author.id, { $set: { color: color } }, { new: true, upsert: true });
      message.reply(`Set your profile color to ${color}`)
    } else {
      message.reply('Please Send me a Hex!')
    }
  }
} 
const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
// Change DIR if needed

module.exports = {
    name: "toggledms",
    aliases: ["dmoff", "dmon", "toggledm"],
    description: "close/open your dms",
    usage: `\`${PREFIX}toggledms\``,
    cooldown: 10,

    execute: async function(client, message) {
        let author = message.author
        let DBUser = await client.DBUser.findById(author.id);
        if (!DBUser) return message.reply('You must signup using the signup command!');
        
        if(DBUser.dmOpt)  {
            await client.DBUser.findByIdAndUpdate(author.id, { $set: { dmOpt: false  } }, { new: true, upsert: true });
            message.reply('I have disabled you\`re DMs')
        } else /* If dmOpt is false */ {
            await client.DBUser.findByIdAndUpdate(author.id, { $set: { dmOpt: true  } }, { new: true, upsert: true });
            message.reply('I have enabled you\`re DMs')
        }
    }
}
const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
// Change DIR if needed

module.exports = {
    name: "setbio",
    description: "Changes your profile bio",
    usage: `\`${PREFIX}setbio [your-bio-text]\``,
    examples: `\`${PREFIX}\`setbio I am a high school student`,
    cooldown: 20,

    execute: async function(client, message, args) {
        let DBUser = await client.DBUser.findById(message.author.id);
        if (!DBUser) return message.reply('You must signup using the signup command!')
        
        if(!args[0]) return message.reply('Please give me a bio!!');
        let description = args.join(' ');
        if (description.length > 100) return message.reply('Your bio cannot go above 100')

        try {
            await client.DBUser.findByIdAndUpdate(message.author.id, { $set: { bio: description } }, { new: true, upsert: true });
            message.reply(`Your Profile Bio is now ${description}`)
        } catch(err) {
            console.log(err)
            message.reply(`Error!\nPlease Contact an Admin about this`)
        }
    }
}
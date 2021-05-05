const PREFIX = require('../../../../../config/botconfig.json').PREFIX;
const moment = require('moment')
// Change DIR if needed

module.exports = {
    name: "signup",
    description: "Make a Account for Cheems Media",
    usage: `\`${PREFIX}signup\``,
    cooldown: 5,

    execute: async function (client, message, args) {
        let DBUser = await client.DBUser.findById(message.author.id)
        if(DBUser) return message.reply('You are already in the database!')
        if(!DBUser) await client.DBUser.findByIdAndUpdate(message.author.id, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
        let JoinDate = moment(new Date()).format('LLLL');
        try {
            message.reply('You have been Signed up! make sure to read our TOS!')
            await client.DBUser.findByIdAndUpdate(message.author.id, { $set: { joindate: JoinDate} }, { new: true, upsert: true });
        } catch (err) {
            console.log(err)
            message.reply(`Error!\nPlease Contact an Admin about this`)
        }

    }
}

const { PREFIX } = require('../../../../config/botconfig.json');
const { blacklist } = require('../../../utils/utils')
// inside the async execute

module.exports = {
    name: "blacklist",
    description: "Adds user to blacklist",
    usage: `\`${PREFIX}blacklist [mention-user]\``,
    examples: `\`${PREFIX}whitelist @Babu\``,
    cooldown: 0,
    adminOnly: true,
    someServersOnly: false,
    
    execute: async function(client, message) {

         const user = message.mentions.users.first()
         if(!user) return message.reply('You didn\'t mention anyone!');

         try{
        blacklist(client, message.mentions.users.first().id)
        console.log(chalk.red(`<${client.user.tag}>`) + (' ') + chalk.blue(`Blacklisted ${user.tag}`))
         } catch(err) {
             console.log(err)
         }
    }
}

const Discord = require("discord.js");
const chalk = require('chalk');
const { PREFIX } = require('../../../../config/botconfig.json');
const { whitelist } = require('../../../utils/utils')
// inside the async execute

module.exports = {
    name: "whitelist",
    description: "Removes the blacklist of an user",
    usage: `\`${PREFIX}whitelist [mention-user]\``,
    examples: `\`${PREFIX}whitelist @Babu\``,
    cooldown: 0,
    adminOnly: true,
    someServersOnly: false,
    
    execute: async function(client, message) {

         const user = message.mentions.users.first()
         if(!user) return message.reply('You didn\'t mention anyone!');

         try {
        whitelist(client, message.mentions.users.first().id)
        console.log(chalk.red(`<${client.user.tag}>`) + (' ') + chalk.blue(`Whitelisted ${user.tag}`))
         } catch(err) {
            console.log(err)
         }
    }
}

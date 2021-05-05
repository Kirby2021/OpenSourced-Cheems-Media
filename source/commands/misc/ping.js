const { PREFIX } = require('../../../config/botconfig.json');
// Change DIR if needed

module.exports = {
    name: "ping",
    description: "See how fast the bot is",
    usage: `\`${PREFIX}ping\``,
    cooldown: 5,
    disabled: false,

    execute: async function(client, message, args) {
        message.reply('Calculating ping...').then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
      
            resultMessage.edit(`Bot latency: ${ping}\nAPI Latency: ${client.ws.ping}`)
          })
    }
}
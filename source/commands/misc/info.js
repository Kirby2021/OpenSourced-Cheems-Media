const { PREFIX } = require('../../../config/botconfig.json');
const { MessageEmbed } = require('discord.js')
// Change DIR if needed

module.exports = {
    name: "info",
    description: "gives info about bot",
    usage: `\`${PREFIX}info\``,
    cooldown: 5,

    execute: async function(client, message, args) {
        const embed = new MessageEmbed()
        .setTitle('Bot Information')
        .addFields(
            { name: "**Board Members**", value: "`EmanSza` Founder/Developer\n`Canta` Founder/Developer\n`Spik` Developer/Owner\n`KrabbyBuckets` Website Developer/Owner\n", inline: true },
            { name: "**Developers**", value: "`Depression` Bot Developer\n", inline: true },
            { name: "**Links**", value: "`website` https://cheemsmedia.xyz\n`Discord` https://join.cheemsmedia.xyz\n`invite` https://invite.cheemsmedia.xyz\n", inline: true },
            { name: "**Langauges**", value: "English", inline: true },
          // { name: "**Extra Embed**", value: "`` \n", inline: true },
        )
        .setColor('#FD0061')
       message.channel.send(embed)
    }
}
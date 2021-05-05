const { PREFIX } = require('../../../../config/botconfig.json');

module.exports = {
    name: "removestaff",
    description: "Removes staff from stafflist",
    usage: `\`${PREFIX}removestaff [mention-user]\``,
    examples: `\`${PREFIX}removestaff @Babu\``,
    cooldown: 0,
    someServersOnly: true,
    adminOnly: true,

    execute: async function(client, message, args) {
      try {
          if(message.author.id != '519861424017768451') return message.reply(`Only <@519861424017768451> can remove staff`)
          if(!message.mentions.users.first()) return message.reply('You need to mention user to remove')
          await client.DBStaff.findByIdAndDelete({ _id: message.mentions.users.first().id });
            message.reply(`Staff <@${message.mentions.users.first().id}> has been removed!`)
            client.stafflist = await client.DBStaff.find({})
            var admins = []
            var devs = []
            client.stafflist.forEach(function (s) {
                if (s.job == 'admin') admins.push(s._id)
                else if (s.job == 'developer') devs.push(s._id)
            })
            client.admins = admins
            client.devs = devs
        } catch(err) {
          message.reply(`Error!\nPlease Contact an Admin about this`)
        }
    }
}

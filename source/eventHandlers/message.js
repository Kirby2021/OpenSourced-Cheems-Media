const { processArguments } = require("../utils/utils")
const { Collection } = require("discord.js")
const cooldowns = new Collection();
const { PREFIX, someServers} = require('../../config/botconfig.json')

module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type === 'dm' || client.blacklistCache.has(message.author.id)) return;

    await client.DBGuild.findByIdAndUpdate(message.guild.id, {new: true, upsert: true})

    if (!message.content.startsWith(PREFIX)) return;

    let msgargs = message.content.substring(PREFIX.length).split(new RegExp(/\s+/));
    let cmdName = msgargs.shift().toLowerCase();

    const command = await client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if (!command) return;
    if(command.adminOnly && !client.admins.includes(message.author.id)) return;
    if(command.devOnly && !client.devs.includes(message.author.id)) return;
    if(command.someServers && !someServers.includes(message.guild.id)) return;
    if(command.disabled === true) return message.reply('This Command is currently disabled!')

    if (command.perms && !message.member.hasPermission(command.perms)) return message.reply(`You are missing ${command.perms}`);

    const cd = command.cooldown;
    if (cd) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = cd * 1000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) return await message.channel.send(`${message.author.username}, please wait ${new Date(expirationTime - now).toISOString().substr(11, 8)} before using this command again.`)
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    if (command.arguments && command.arguments.length !== 0) msgargs = processArguments(message, command.arguments, msgargs)
    if (!msgargs) return;
    try {
        command.execute(client, message, msgargs);
    } catch (error) {
        message.channel.send(`Oops, something went wrong!`)
        console.log(`Error occured!\nAt command: ${command.name}\nError message: ${error.message}\nError trace: ${error.trace}`)
    }
};

//Require Modules
const Discord = require('discord.js');
const mongoose = require('mongoose');
const path = require('path');

const chalk = require("chalk");
const log = console.log;

//File Requirements
const { TOKEN, MONGOURI, TOPGGTOKEN } = require(path.join(__dirname, "../config/botconfig.json"));
const { registerCommands, registerEvents } = require(path.join(__dirname, "./utils/registry"))
const InitateTopGG = require('./utils/topgg')
// Client Statements
const client = new Discord.Client()

//Cient Ready Statement
client.on('ready', () => {
    client.user.setPresence({ activity: {name: '!help', type: 'LISTENING'}})
}); { setTimeout(() => { log(chalk.red(`<CLIENT>`) + (' ') + chalk.blue(`Logged in`)); }, 1000 * 3)}


// Async Fucktion
(async () => {
    client.blacklistCache = new Set()
    InitateTopGG(client)
    await client.login(TOKEN).then(console.log(chalk.red(`<CLIENT>`) + (' ') + chalk.blue('Starting up...')));
    client.commands = new Discord.Collection();
    await registerEvents(client, '../eventHandlers').then(log(chalk.magenta('<HANDLER>') + (' ') + chalk.blue(`Loaded Events`)));
    await registerCommands(client, '../commands').then(log(chalk.magenta('<HANDLER>') + (' ') + chalk.blue(`Loaded Commands`)));
    //Schemas
    client.DBConfig = require('../config/schema/config')
    await mongoose.connect(MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });  { setTimeout(() => { log(chalk.cyan(`<DATABASE>`) + (' ') + chalk.blue(`Connected`)); }, 5) }

    client.DBUser = require('../config/schema/user.js');
    client.DBPost = require('../config/schema/posts.js');
    client.DBGuild = require('../config/schema/guild.js')
    client.DBStaff = require('../config/schema/staff.js')
    client.DBComments = require('../config/schema/comments.js')
    //Blacklist
    const blacklistFetch = await client.DBConfig.findByIdAndUpdate('blacklist', {}, {new: true, upsert: true, setDefaultsOnInsert: true})
    client.blacklistCache = new Set(blacklistFetch.blacklisted)
    const stafflist = await client.DBStaff.find({})
    if (stafflist) client.stafflist = stafflist
    var admins = []
    var devs = []
    client.stafflist.forEach(function (s) {
      if (s.job == 'admin') admins.push(s._id)
      else if (s.job == 'developer') devs.push(s._id)
    })
    client.admins = admins
    client.devs = devs
})();

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

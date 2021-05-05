const { PREFIX } = require('../../../config/botconfig.json')
const axios = require('axios')
// Change DIR if needed

module.exports = {
    name: "vote",
    description: "",
    usage: `\`${PREFIX}\``,
    examples: `\`${PREFIX}\``,
    cooldown: 5,
    disabled: true,

    execute: async function (client, message, args) {
        const channel = '812529308811132989'
        const user = message.author
        const teamId = 'cheems media'

        const url = `https://wornoffkeys.com/api/competition/voting?userId=${user.id}&teamId=${teamId}`


        const { data } = await axios.post(url)
            .catch((err) => {
                if (err.response.data) {
                    const { message: text } = err.response.data
                    console.error(text)
                    message.reply(text)
                    return;
                }
                console.error(err)
            })
        if (data.success) {
            message.reply('Thank you for voting Cheems')
        }
         channel.send(`${user.tag} has or tried voted!`)
    }
}

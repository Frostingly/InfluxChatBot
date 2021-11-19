import mc from 'mineflayer'
import client from '../index'

export default () => {
    // @ts-ignore
    const bot = mc.createBot({
        host: 'mc.hypixel.net',
        username: process.env.email,
        password: process.env.password,
        auth: 'microsoft'
    });

    bot.once('login', () => {
        console.log("[Minecraft] Successfully logged in as " + bot.username)
        bot.chat("Leaderboards and Guild Chat successfully connected. #InfluxOP")
    })

    bot.on('message', message => {
        if (message.toString().includes(bot.username)) return;
        if (message.toString().startsWith("Guild >")) {
            console.log(message.toString());
            client.channels.fetch('909171597133377596').then(channel => {
                // @ts-ignore
                channel?.send(message.toString()
                    .replace("@everyone", "")
                    .replace("@here", "")
                    .replace("Guild > ", ""));
            })
        }
    })


    bot.on('kicked', () => bot.connect({
        host: 'mc.hypixel.net',
        // @ts-ignore
        username: process.env.email,
        password: process.env.password,
        auth: 'microsoft'
    }))

    bot.on('error', () => bot.connect({
        host: 'mc.hypixel.net',
        // @ts-ignore
        username: process.env.email,
        password: process.env.password,
        auth: 'microsoft'
    }))

    client.on('messageCreate', (message) => {
        if (message.author.bot === true) return;
        if (message.channel.id === '909171597133377596') {
            bot.chat(message.author.username + ": " + message.content)
        }
    })
}
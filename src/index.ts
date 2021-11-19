require('dotenv').config()
import Discord, { Collection, Client } from 'discord.js'
import Minecraft from './chat_bots/Minecraft'
import leaderboard from './functions/Leaderboard'
import schedule from 'node-schedule'

const client = new Client({
    intents: [
        'GUILD_MESSAGES',
        'GUILD_MEMBERS',
        'GUILDS',
        'GUILD_INTEGRATIONS',
        'GUILD_MESSAGE_TYPING',
        'GUILD_PRESENCES',
        'GUILD_BANS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_INVITES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_PRESENCES',
        'GUILD_VOICE_STATES',
        'GUILD_WEBHOOKS'
    ],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
})

client.on('ready', async () => {
    console.log("[Status] Online")
  
    schedule.scheduleJob('55 5 * * *',function () {
        leaderboard("911262312365707275", client);
    });
})

client.login(process.env.TOKEN)

export default client;

Minecraft();
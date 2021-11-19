import fetch from 'node-fetch'
import Discord from 'discord.js'

export default function Leaderboard(channelID: string, client: Discord.Client) {
    // Date object initialized as per New Zealand timezone. Returns a datetime string
    let nz_date_string = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

    let date = nz_date_string.split(", ")[0].split("/");

    let month = parseInt(date[1]) < 10 ? `0${date[1]}` : date[1];
    let day = parseInt(date[0]) < 10 ? `0${date[0]}` : date[0];

    let today = date[2] + '-' + day + '-' + month;

    const guild = `https://api.hypixel.net/guild?name=Influx&key=${process.env.API_KEY}`
    let data: any = []
    fetch(guild)
        .then((guildInfo: any) => guildInfo.json())
        .then((guildInformation: any) => {
            for (let i = 0; i < guildInformation.guild.members.length; i++) {
                const usernames = `https://api.mojang.com/user/profiles/${guildInformation.guild.members[i].uuid}/names`
                fetch(usernames)
                    .then((username: any) => username.json())
                    .then((usernamesJson: any) => {
                        let array = {
                            username: usernamesJson[usernamesJson.length - 1].name,
                            gexp: guildInformation.guild.members[i].expHistory[today]
                        };
                        data.push(array);
                        data.sort((a: any, b: any) => b.gexp - a.gexp);
                    })
                    .then(() => {
                        if(data.length == guildInformation.guild.members.length){
                            let embed = new Discord.MessageEmbed()
                                .setTitle(`Influx Daily GEXP Leaderboard ${today}`)
                                .setColor("GOLD")

                            data.slice(0, 10)

                            let description = "";

                            for (let i = 0; i < 10; i++) {
                                let stat = data[i];
                                let newAmount = stat.gexp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                if (stat.gexp !== 0) {
                                    description += `\`${i + 1}.\` ${stat.username} ${newAmount} Guild Experience\n`;
                                }
                            }

                            embed.setDescription(description);

                            client.channels.fetch(channelID).then(channel => {
                                // @ts-ignore
                                channel?.send({ embeds: [embed] });
                            });

                        }
                    })
            }
        });
}
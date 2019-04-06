module.exports.run = async (message, arg, client, errors, emb) => {
    const m = await message.channel.send('Wait...');
    m.edit(`:ping_pong: | Ping: **${m.createdTimestamp - message.createdTimestamp}**ms. API: **${Math.round(client.ping)}**ms`);
}

module.exports.help = {
	name: "ping",
	aliases: ['pingg'],
	description: "Displays latency to Discord servers"
}
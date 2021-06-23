module.exports = {
    dump(client) {
        let interval = setInterval(function () {
            client.channels.cache.get("857367187077332993").send("!d bump");
        }, 121 * 1000);
    }
}
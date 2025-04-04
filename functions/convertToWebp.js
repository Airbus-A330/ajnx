const webp = require("webp-converter");

module.exports = async (buffer, percentage) => {
    return await webp.buffer2webpbuffer(buffer, `png`, "-q " + percentage);
};

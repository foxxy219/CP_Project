const expirationTimeInSeconds = 36000; // 1 hour (60 seconds * 60 minutes)
const currentTimestamp = Math.floor(Date.now() / 1000); // Get current Unix timestamp
const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;

module.exports = { expirationTimestamp };
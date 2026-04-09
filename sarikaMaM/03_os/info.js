const os = require("os");

console.log("System Info:");
console.log("OS Platform:", os.platform());
console.log("CPU Architecture:", os.arch());
console.log("Total Memory:", os.totalmem() / (1024 * 1024 * 1024), "GB");
console.log("Free Memory:", os.freemem() / (1024 * 1024 * 1024), "GB");
console.log("CPU Cores:", os.cpus().length);
console.log("Hostname:", os.hostname());
console.log("Uptime (minutes):", os.uptime() / 60);
const cluster = require("cluster");
if (cluster.isMaster) {
const cpuCount = os.cpus().length;
for (let i = 0; i < cpuCount; i++) {
cluster.fork();
}
} else {
console.log(`Worker ${process.pid} started`);
}
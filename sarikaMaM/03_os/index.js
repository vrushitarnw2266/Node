const os = require('os');

//1. os.arch() - returns the operating system CPU architecture
console.log('CPU Architecture:', os.arch());

//2. os.platform() - returns the operating system platform
console.log('Operating System Platform:', os.platform());

//3. os.cpus() - returns an array of objects containing information about each CPU/core installed
console.log('CPU Information:', os.cpus());

//4. os.totalmem() - returns the total amount of system memory in bytes
console.log('Total Memory:', os.totalmem());

//5. os.freemem() - returns the amount of free system memory in bytes
console.log('Free Memory:', os.freemem());

//6. os.hostname() - returns the hostname of the operating system
console.log('Hostname:', os.hostname());

//7. os.uptime() - returns the system uptime in seconds
console.log('System Uptime (seconds):', os.uptime());

//8. os.userInfo() - returns information about the currently logged-in user
console.log('User Information:', os.userInfo());

// 9. os.homedir() - returns the home directory of the current user
console.log('Home Directory:', os.homedir());

//10. os.tmpdir() - returns the default directory for temporary files   
console.log('Temporary Directory:', os.tmpdir());

//11. os.type() - returns the operating system name
console.log('Operating System Name:', os.type());

//12. os.release() - returns the operating system release version
console.log('Operating System Release Version:', os.release());

//13. os.networkInterfaces() - returns an object containing network interfaces that have been assigned a network address
console.log('Network Interfaces:', os.networkInterfaces());

//14. os.endianness() - returns the endianness of the CPU (either 'BE' for big-endian or 'LE' for little-endian)
console.log('CPU Endianness:', os.endianness()); 


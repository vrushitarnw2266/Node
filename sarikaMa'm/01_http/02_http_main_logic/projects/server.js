// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const server = http.createServer((req, res) => {
//    if (req.url === '/') {
//        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
//            res.writeHead(200, { 'Content-Type': 'text/html' });
//            res.write(data);
//            res.end();
//        });
//    }
//   else if (req.url === '/about') {
//        fs.readFile(path.join(__dirname, 'about.html'), (err, data) => {
//            res.writeHead(200, { 'Content-Type': 'text/html' });
//            res.write(data);
//            res.end();
//        });
//    }

//    else {
//        res.writeHead(404, { 'Content-Type': 'text/html' });
//        res.write("<h1>404 Page Not Found</h1>");
//        res.end();
//    }

// });

// server.listen(3000, () => {
//    console.log("Server running at http://localhost:3000");
// });


const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res)=>{
    if(req.url === '/'){
        fs.readFile('index.html', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if(req.url === '/about'){
        fs.readFile('about.html', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else{
        fs.readFile('404.html', (err, data) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    }
});
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});


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
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '';
    let contentType = 'text/html';

    if (req.url === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else if (req.url === '/about') {
        filePath = path.join(__dirname, 'about.html');
    } else if (req.url.endsWith('.css')) {
        filePath = path.join(__dirname, req.url);
        contentType = 'text/css';
    } else {
        filePath = path.join(__dirname, '404.html');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // If 404.html doesn't exist either, send a simple message
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(req.url === '/' || req.url === '/about' ? 200 : (req.url.endsWith('.css') ? 200 : 404), { 'Content-Type': contentType });
            res.end(data, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


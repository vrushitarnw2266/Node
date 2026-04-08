const http = require('http');
// http.createServer((request, response) =>{
//     const path = request.url;
//     const method = request.method;
//     console.log(`Received ${method} request for: ${path}`);

//     if(path.includes("/abc") && method === "GET"){
//         response.write('You have reached the /abc endpoint');
//         response.end();
//     }
//     else{
//         response.write('Hello World!');
//         response.end()
//     }
    
// }).listen(3000);

// console.log("server started on port 3000")

const server = http.createServer((request, response) =>{
    // response.write('Hello World!');
    // response.write('This is a simple HTTP server.');
    // response.end();
    
    if(request.url === "/"){
        response.end("home page");
}else if (request.url === "/about"){
    response.end("about page");
}else {
    response.end("404 not found");
}

});
PORT = 3000;
server.listen(PORT, () =>{
    console.log(`server started on port ${PORT}`)
})
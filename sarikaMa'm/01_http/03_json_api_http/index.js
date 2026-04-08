const http = require('http');
const url = require('url');

const PORT = 3000;

let mockUsers = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
];

// Helper to send JSON responses
const sendJSON = (res, statusCode, data) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
};

// Helper to parse JSON body
const getBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(err);
            }
        });
    });
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // Welcome Route
    if (path === '/' && method === 'GET') {
        return sendJSON(res, 200, { message: 'Welcome to the Enhanced JSON API!' });
    }

    // List Users or Create User
    if (path === '/api/users') {
        if (method === 'GET') {
            return sendJSON(res, 200, mockUsers);
        }
        if (method === 'POST') {
            try {
                const body = await getBody(req);
                const newUser = {
                    id: mockUsers.length + 1,
                    ...body
                };
                mockUsers.push(newUser);
                return sendJSON(res, 201, newUser);
            } catch (err) {
                return sendJSON(res, 400, { error: 'Invalid JSON body' });
            }
        }
    }

    // Get Single User
    if (path.startsWith('/api/users/') && method === 'GET') {
        const id = parseInt(path.split('/').pop());
        const user = mockUsers.find(u => u.id === id);
        if (user) {
            return sendJSON(res, 200, user);
        } else {
            return sendJSON(res, 404, { error: 'User not found' });
        }
    }

    // Echo Route
    if (path === '/api/echo' && method === 'POST') {
        try {
            const body = await getBody(req);
            return sendJSON(res, 200, { received: body, timestamp: new Date().toISOString() });
        } catch (err) {
            return sendJSON(res, 400, { error: 'Invalid JSON body' });
        }
    }

    // 404 Not Found
    sendJSON(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

// Vercel Serverless Function entry point
// This re-exports the Express app from the server so Vercel can handle requests
module.exports = require('../server/index.js');

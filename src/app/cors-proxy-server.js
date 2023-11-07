const CorsProxy = require("cors-anywhere");

const host = "0.0.0.0"; // Listen on all network interfaces
const port = 8080; // Choose a port

const server = new CorsProxy.Server({
  originWhitelist: [], // Allow all origins
});

server.listen(port, host, () => {
  console.log(`CORS Anywhere proxy server is running on ${host}:${port}`);
});

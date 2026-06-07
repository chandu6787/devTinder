const http = require("http");
const data = JSON.stringify({});
const options = {
  hostname: "localhost",
  port: 3000,
  path: "/profile/edit",
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(data),
    Origin: "http://localhost:5173",
  },
};
const req = http.request(options, (res) => {
  console.log("statusCode", res.statusCode);
  console.log("headers", res.headers);
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => {
    console.log("body", body);
  });
});
req.on("error", (err) => {
  console.error("err", err.message);
});
req.write(data);
req.end();

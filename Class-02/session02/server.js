const express = require("express");
const app = express();
// OPTIONAL: app.use(express.static("assets"))
const HTTP_PORT = process.env.PORT || 8080;
// OPTIONAL: used if you are sending files back to the client
const path = require("path")
app.get("/", (req, res) => {
res.send("Welcome to our web server!")
});


const onHttpStart = () => {
console.log("The web server has started...");
console.log(`Server is listening on port ${HTTP_PORT}`);
console.log("Press CTRL+C to stop the server.");
};


app.listen(HTTP_PORT, onHttpStart);

const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// import --> library that is built into NodeJS
// - it allows you get easily display the file system directories
const path = require("path");

// setup a static assets folder
// used to serve static assets
// go find a folder called assets, and look for the css/images in there
app.use(express.static("assets"));

app.get("/filedemo", (req, res) => {
  // write code to send a file back to the client
  res.sendFile(path.join(__dirname, "course-outline.pdf"));
});

app.get("/pokemon", (req, res) => {
  // write code to send a file back to the client
  // __dirName = a built in NodeJS variable that retrieves
  // the current directory of the project
  console.log(`What is dirname: ${__dirname}`);

  // path.join() combines the __dirname and "char.png" into 1 string
  const x = path.join(__dirname, "char.png");
  console.log(`What is path.join? ${x}`);
  res.sendFile(path.join(__dirname, "char.png"));
});

//show the html file
//Exercise
app.get("/page", (req, res) => {
  // write code to send a file back to the client
  res.sendFile(path.join(__dirname, "mypage.html"));
});

app.get("/abcd", (req, res) => {
    // write code to send a file back to the client

    res.send("HElloooo")
  });

//css, image files --> ASSETS (Static Assets)
// the server can automatically find our assets (images, css)
// without you manually create an endpoint for it

//Delete all endpoints for images and css bcz now we don't need them

//For images
// app.get("/char.png", (req, res) => {
//   res.sendFile(path.join(__dirname, "char.png"));
// });

// app.get("/pikachu.png", (req, res) => {
//   res.sendFile(path.join(__dirname, "pikachu.png"));
// });

// //show the css file
// app.get("/styles.css", (req, res) => {
//   // write code to send a file back to the client

//   res.sendFile(path.join(__dirname, "styles.css"));
// });

const onHttpStart = () => {
  console.log("The web server has started...");
  console.log(`Server is listening on port ${HTTP_PORT}`);
  console.log("Press CTRL+C to stop the server.");
};

app.listen(HTTP_PORT, onHttpStart);

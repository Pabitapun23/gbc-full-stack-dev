const express = require("express");
const app = express();
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.json());

// call this function after the http server starts listening for requests
const onServerStart = () => {
  console.log("Express http server listening on: " + HTTP_PORT);
  console.log(`http://localhost:${HTTP_PORT}`);
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// create endpoint to be used as API to get the data
// server needs to send JSON data as response
app.get("/dummyapi/allplaces", (req, res) => {
  // to send one object as response
  // let resObj = {
  //     placeName : "Dreamy Place",
  //     distance : 100,
  //     isOpen : false,
  // }

  // res.json();

  //to send object with an array
  let resObj = [
    {
      placeName: "Dreamy Place",
      distance: 200,
      isOpen: false,
    },
    {
      placeName: "Under the sky",
      distance: 0,
      isOpen: true,
    },
    {
      placeName: "Sacred Place",
      distance: 540,
      isOpen: true,
    },
  ];
  res.json(resObj);
});

app.get("/dummyapi/place/:placeName", (req, res) => {
    //search the database using placeName and response with object if any matching place found

    let placeName = req.params.placeName;

    // Compare the given placeName with desired column in the database and response with the result
    let resObj = {
        placeName : "Dreamy Place", 
        distance: 200, 
        isOpen: false
    };

    res.json(resObj);
})

//update
app.put("/dummyapi/place/:placeName", (req, res) => {})

//create
app.post("/dummyapi/place/:placeName", (req, res) => {})

//delete
app.delete("/dummyapi/place/:placeName", (req, res) => {})

app.listen(HTTP_PORT, onServerStart);

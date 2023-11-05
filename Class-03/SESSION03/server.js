const express = require("express");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
const path = require("path");

const multer = require("multer");

//use multer.diskStorage() to specify the storage location for files and filename
const myStorage = multer.diskStorage({
  destination: "./public/photos/",
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

//associate the storage config to multer middleware
const upload = multer({ storage: myStorage });

//https://www.npmjs.com/package/multer
// multer is a middleware that will allow the server to process the data sent by the form
// as multipart/form-data
// this will be helpful to receive files sent by the user with form data
// multer will also allow the server to configure the directory where the files need to be saved
// also allows to configure the file name
// use the following command to install multer to your project
// npm install --save multer

// to use/access data sent by form
// used to configure express server to interpret the data sent by <form> element
// .must be written after app const declaration and before post route that processes that data
app.use(express.urlencoded({ extended: true }));

// set the public folder as static directory of server from where the static resources can be loaded
// we will use this to save / load the pictures
app.use(express.static("./public/"));

app.get("/", (req, res) => {
  //deliver index.html page on default endpoint
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/test", (req, res) => {
  console.log(`Message from server`);
});

app.get("/contact-us", (req, res) => {
  console.log(`Presenting contact-use.html now`);
  res.sendFile(path.join(__dirname, "contact-us.html"));
});

//post req is considered more secure than get
//use the POST request when sending the data from HTML to server to make it more secure
// app.post("/send-feedback", (req, res) => {
app.post("/send-feedback", upload.single("photo"), (req, res) => {
  console.log("POST request received for feedback");

  // body property from request object will provide the form data sent by HTML page
  // console.log(`req.body: ${req.body}`);

  // JSON.stringify() - to convert JSON object into string representation
  // console.log(`req.body String format : ${JSON.stringify(req.body)}`);

  const formFile = req.file;
  if (req.file === undefined) {
    console.log(`photo not provided with form data`);
  } else {
    console.log(`photo will be saved to the public storage`);
  }

  if (req.body !== undefined) {
    // To access form inputs, use the value of name attribute with body property
    // For example:
    // for the following input
    // <input type="text" placeholder="Enter Player name" name="playerName" />

    // use ${req.body.playerName} to access the form data

    console.log(`Name: ${req.body.customerName}`);
    console.log(`Message: ${req.body.messageFromUser}`);
    console.log(`Discovery Method: ${req.body.discoveryMethod}`);

    const name = req.body.customerName;
    const discovery = req.body.discoveryMethod;
    const message = req.body.messageFromUser;

    //trying to access form field which isn't present on the form
    // return undefined
    console.log(`email : ${req.body.emailAddress}`);

    if (discovery === "email") {
      if (formFile === undefined) {
        res.send(
          `Thank you for your feedback ${name}. We appreciate access our email.`
        );
      } else {
        res.send(`
            <p> Thank you for your feedback ${name} </p>
            <img src = '/photos/${formFile.filename}' />
        `);
      }
    } else if (discovery === "friend") {
      res.send(`You have great friends, ${name}`);
    } else if (discovery === "google") {
      res.send(`${name}, your search engine works hard for you.`);
    }

    // res.send("Form data has been processed");
  } else {
    //operations to perform if the data is not received
    res.send("Unable to receive data from form");
  }

  //this will give error
  //   res.send("Completed form processing")
});

// Task to do
// show the result of students
app.get("/student", (req, res) => {
  console.log(`This shows student.html file`);
  res.sendFile(path.join(__dirname, "student.html"));
});

app.post("/send-result", (req, res) => {
  console.log(`POST request is used to check result of students`);

  // console.log(`req.body: ${req.body}`)

  let grade = "";

  if (req.body !== undefined) {
    //to get the datas of student from form
    console.log(`Student ID: ${req.body.studentID}`);
    console.log(`Student Name: ${req.body.studentName}`);
    console.log(`Percentage: ${req.body.percentage}`);

    const id = parseInt(req.body.studentID);
    const name = req.body.studentName;
    const percentage = parseFloat(req.body.percentage);

    //Parsed inputs
    console.log(`Student ID: ${id}`);
    console.log(`Student Name: ${name}`);
    console.log(`Percentage: ${percentage}`);

    // validation
    if (isNaN(id) || isNaN(percentage)) {
      console.log("Enter valid data");
      res
        .status(400)
        .send(
          `<p style="color:red">Enter a valid id or percentage of student</p>`
        );
    }

    console.log(`${percentage > 50}`);

    // For getting grade of students from their percentage
    switch (true) {
      case percentage >= 95:
        grade = "A+";
        break;
      case percentage >= 90 && percentage < 95:
        grade = "A";
        break;
      case percentage >= 80 && percentage < 90:
        grade = "B+";
        break;
      case percentage >= 70 && percentage < 80:
        grade = "B";
        break;
      case percentage >= 60 && percentage < 70:
        grade = "C+";
        break;
      case percentage >= 50 && percentage < 60:
        grade = "C";
        break;
      case percentage >= 45 && percentage < 50:
        grade = "D+";
        break;
      case percentage < 45:
        grade = "F";
        break;
      default:
        grade = `<p style="color:red; padding:0 20px;">Unable to evaluate the student's grade</p>`;
        break;
    }

    res.send(`<div style="border: 1px solid lightgray; font-size: 30px; width: 60%; margin: 20px auto; padding: 20px; border-radius:10px;">
                    <p style="padding:0 20px;"> Student ID: <span style="color: gray; 
                    font-size: 30px;"> ${id} </span> </p>

                    <p style="padding:0 20px;"> Student Name: <span style="color: gray;
                    font-size: 30px;"> ${name} </span> </p>

                    <p style="padding:0 20px;"> Grade: <span style="color: gray;
                    font-size: 30px;"> ${grade} </span> </p>
                </div>`);
  } else {
    res.send(`<p style="color:red;">Unable to receive data from form</p>`);
  }
});

const onHTTPStart = () => {
  console.log(`Server has started. Visit http://localhost:${HTTP_PORT}`);
  console.log(`User Ctrl + C to stop the server`);
};

app.listen(HTTP_PORT, onHTTPStart);

// Write code

const express = require("express");
const app = express();

// write the code to create a web server
// - automatically assign a PORT Number that your server will run on
// - get the default port from the person's computer (porcess.env.PORT), and if you cannot
// find a default port, then use port 8080
const HTTP_PORT = process.env.PORT || 8080;

// --------------------------------

// defining a server endpoint
// - specify a location that a browser can connect to
app.get("/test", (req, res) => {
  console.log("Message received.");
});

// --------------------------------
// function with 2 parameters
// param 1 = string --> location (endpoint)
// param 2 = function --. response
// what should happen when the person connects to the endpoint
app.get("/", () => {
  // do nothing
});
app.get("/nitro", () => {
  // execute some logic
});
app.get("/safety", () => {
  // display a string in browser
});
app.get("/sdfsdf", () => {
  // display a html file
});

// document.addEventListener("click", () => {});

// function
// - this is the function that executes when the web server starts
const onHttpStart = () => {
  console.log("The web server has started...");
  console.log(`Server is listening on port ${HTTP_PORT}`);
  console.log("Press CTRL+C to stop the server.");
};

app.listen(HTTP_PORT, onHttpStart);

app.get("/a", (req, res) => {
  console.log("DEBUG: Request received at the /a endpoint");
  // respond to the client with a string
  res.send("Hello world!");
});

app.get("/b", (req, res) => {
  console.log("DEBUG: Request received at the /a endpoint");
  // respond to the client with a string
  // (HTML string = string that contains html)
  res.send("<p> I am a paragraph! </p><a href='#'> I am a link </a>");
});

app.get("/c", (req, res) => {
  console.log("DEBUG: Request received at the /a endpoint");
  // respond with more complex html string

  const output = `
        <header>
            <p> Navigation links: </p>
            <ul style="border:1px solid blue; padding:20px; list-style-type:none; text-decoration:none; color:black;">
                <li><a href="#">Home</a></li>
                <li><a href="#">Schedule</a></li>
                <li><a href="#">Contact Us</a></li>
            </ul>
        </header>
        <main>
            <h1>Welcome to my page</h1>
            <p style="background-color:yellow;">sdfsdfds</p>
            <p>sdfsdfds</p>          
        </main>
    `;
  console.log(typeof output); // show the data type of the output var to the screen
  res.send(output);
});

// app.get("/students", (req, res) => {
//   // console.log("DEBUG: Request received at the /students endpoint");
//   //define a list of students

//   const studentsList = [
//     { name: "Mark", gpa: 3.9 },
//     { name: "Peter", gpa: 4.0 },
//     { name: "Sarah", gpa: 2.1 },
//     { name: "Jane", gpa: 1.0 },
//     { name: "Lia", gpa: 2.59 },
//   ];

//   let output = `
//         <main>
//             <h1>Welcome to my page</h1>
//             <p> Students List : </p>
//             <ol style="border:1px solid blue; padding:20px; background-color:skyblue;">`;

//   for (student of studentsList) {
//     output += `<li>Name: ${student.name}, GPA: ${student.gpa}</li>`;
//   }
//   output += `</ol>
//           </main>`;

//   // show the data type of the output var to the screen

//   res.send(output);

// });

//Solution of Prof. Jenelle
//Exercise 1
app.get("/students", (req, res) => {
  // define a list of students
  const studentsList = [
    { name: "Peter", gpa: 3.0 },
    { name: "Suzy", gpa: 2.5 },
    { name: "Carlos", gpa: 2.0 },
    { name: "Emily", gpa: 1.25 },
    { name: "Diego", gpa: 4.0 },
  ];

  let output = "<ol>";
  for (student of studentsList) {
    // option 1
    // const liHTML = `<li>Name: ${student.name}, GPA: ${student.gpa}</li>`
    // output = output + liHTML

    // option 2:
    output += `<li style="background-color:cyan">Name: ${student.name}, GPA: ${student.gpa}</li>`;
  }
  output += "</ol>";

  // output = <ol>
  // <li>sdfdsf</li>
  // <li>sdfdsf</li>
  // <li>sdfdsf</li>
  // <li>sdfdsf</li>
  // <li>sdfdsf</li>
  // </ol>

  res.send(output);
});

//Exercise 2
app.get("/students2", (req, res) => {
  // define a list of students
  const studentsList = [
    { name: "Peter", gpa: 3.0 },
    { name: "Suzy", gpa: 2.5 },
    { name: "Carlos", gpa: 2.0 },
    { name: "Emily", gpa: 1.25 },
    { name: "Diego", gpa: 4.0 },
  ];

  let output = "<ol>";

  for (let i = 0; i < studentsList.length; i++) {
    // even numbers always have 0 remainder
    if (i % 2 === 0) {
      output += `<li style="background-color:cyan">Name: ${studentsList[i].name}, GPA: ${studentsList[i].gpa}</li>`;
    } else {
      output += `<li style="background-color:yellow">Name: ${studentsList[i].name}, GPA: ${studentsList[i].gpa}</li>`;
    }
  }
  output += "</ol>";

  res.send(output);
});

//Exercise 3
app.get("/students3", (req, res) => {
  // define a list of students
  const studentsList = [
    { name: "Peter", gpa: 3.0 },
    { name: "Suzy", gpa: 2.5 },
    { name: "Carlos", gpa: 2.0 },
    { name: "Emily", gpa: 1.25 },
    { name: "Diego", gpa: 4.0 },
  ];

  let output = "<ol>";

  for (let i = 0; i < studentsList.length; i++) {
    // even numbers always have 0 remainder

    if (i % 2 === 0) {
      output += `<li style="background-color:cyan">`;
    } else {
      output += `<li style="background-color:yellow">`;
    }

    output += `<p> Name: ${studentsList[i].name}, GPA: ${studentsList[i].gpa}`;

    if (studentsList[i].gpa < 2.5) {
      output += `<span style="background-color:white; color:magenta">
    You are failing
    </span>`;
    }

    output += `</p>`

    output += `</li>`;
  }
  output += "</ol>";

  res.send(output);
});

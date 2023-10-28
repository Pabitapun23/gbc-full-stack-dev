const express = require("express");
const app = express();
// OPTIONAL: app.use(express.static("assets"))
const HTTP_PORT = process.env.PORT || 8080;
// OPTIONAL: used if you are sending files back to the client
const path = require("path");

//-----------
// import handlebars
const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
//-----------

//Array of students
const studentsDb = [
  { name: "Peter", age: 25 },
  { name: "Karen", age: 83 },
  { name: "Louise", age: 17 },
  { name: "Mary", age: 80 },
  { name: "Quentin", age: 35 },
  { name: "Emily", age: 22 },
];

// show a handlebars page
// programatically update how that page looks
// using code (variable, loops, if statements)
// send a variable to the HBS file
app.get("/", (req, res) => {
  res.render("test-template", {
    layout: false,
    myName: "Arnold",
    myAge: 20,
    testScores: [100, 90, 35, 82.5],
    studentList: [
      { name: "Peter", age: 15 },
      { name: "Sam", age: 25 },
      { name: "Ashley", age: 20 },
      { name: "Mark", age: 30 },
      { name: "Lia", age: 16 },
    ],
    studentsDb: [
      { name: "Peter", age: 25 },
      { name: "Karen", age: 83 },
      { name: "Louise", age: 17 },
      { name: "Mary", age: 80 },
      { name: "Quentin", age: 35 },
      { name: "Emily", age: 22 },
    ],
  });
});

// Exercise 2
// search for all students who can vote
// legal age of voting (25)
// After you find those students
// send them to the template
// Show a list of students who can vote

// the first voting exercise (only the people who can vote > 25)
app.get("/vote1", (req, res) => {
  //1. Create an array of the people who can vote
  let results = [];
  let nonVoters = [];
  for (student of studentsDb) {
    if (student.age > 25) {
      results.push(student);
    } else {
      nonVoters.push(student);
    }
  }
  console.log("DEBUG: The students who can vote are:");
  console.log(results);

  // 2. Send that array to the res.render() so that you can display in template
  res.render("exercise-template", {
    layout: false,
    studentsWhoCanVote: results,
    studentWhoCannotVote: nonVoters,
  });
  // 3. In the template, {{ each }} to loop and show
});

// For Conditions
app.get("/conditions", (req, res) => {
  const price = 10000;

  let msg = "";
  if (price < 0) {
    msg = "Sorry, you must enter a positive number";
  }

  // template must show an error message

  res.render("conditions-template", {
    layout: false,
    a: 234234324,
    b: false,
    errorToDisplay: msg,
  });
});

app.get("/demo", (req, res) => {
    res.render("abc-template", {layout:"my-layouts"});
});

app.get("/demo2", (req, res) => {
    res.render("pqr-template", {layout:"my-layouts"});
});

app.get("/demo3", (req, res) => {
    res.render("xyz-template", {layout:"my-layouts"});
});

const onHttpStart = () => {
  console.log("The web server has started...");
  console.log(`Server is listening on port ${HTTP_PORT}`);
  console.log("Press CTRL+C to stop the server.");
};

app.listen(HTTP_PORT, onHttpStart);

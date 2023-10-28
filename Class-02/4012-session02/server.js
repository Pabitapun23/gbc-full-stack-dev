const express = require("express");
const app = express();
// OPTIONAL: app.use(express.static("assets"))
const HTTP_PORT = process.env.PORT || 8080;
// OPTIONAL: used if you are sending files back to the client
const path = require("path");

// -------------------
// import handlebars
const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
// -------------------


const studentsDb =  [
  {name:"Peter", age:25},
  {name:"Karen", age:83},
  {name:"Louise", age:17},
  {name:"Mary", age:80},
  {name:"Quentin", age:35},
  {name:"Emily", age:22},
]

// the first voting exercise (only the people who can vote > 25)
app.get("/vote1", (req, res) => {
  // 1. Create an array of the people who can vote
  let results = []
  for (student of studentsDb) {
    if (student.age > 25)
    {
      results.push(student)
    }
  }
  console.log("DEBUG: The students who can vote are:")
  console.log(results)
  // 2. Send that array to the res.render() so that you can display in template
  res.render("exercise-template", 
  {layout:false, studentsWhoCanVote:results})
  // 3. In  the template, {{ each }} to loop and show
})


// If you are done this, try page 16 
app.get("/", (req, res) => {
  // search for all students who can vote
  // legal age of voting (25)
  // After you find those students
  // send them to the template
  // Show a list of students who can vote
  
  res.render("test-template",
     {  
        layout: false, 
        myName:"Arnold", 
        myAge:99,
        testScores:[100, 90, 35, 100, 82.5],
        studentsList: [
          {name:"Peter", age:25},
          {name:"Karen", age:83},
          {name:"Louise", age:17},
        ]
      }
    );   
});

app.get("/conditions", (req,res) => {
  const price = 10000

  let msg = ""
  if (price < 0) {
    msg = "Sorry, you must enter a positive number"
  }

  // template must show an error message


  res.render(
    "conditions-template", 
    {
      layout:false,
      a:234234324, 
      b:false,
      errorToDisplay: msg

    } 
  )
})



app.get("/demo", (req,res) => {
  res.render("abc-template", {layout:"my-layout"})
})

app.get("/demo2", (req,res) => {
  res.render("pqr-template", {layout:"my-layout"})
})
app.get("/demo3", (req,res) => {
  res.render("xyz-template", {layout:"my-layout"})
})


const onHttpStart = () => {
  console.log("The web server has started...");
  console.log(`Server is listening on port ${HTTP_PORT}`);
  console.log("Press CTRL+C to stop the server.");
};

app.listen(HTTP_PORT, onHttpStart);

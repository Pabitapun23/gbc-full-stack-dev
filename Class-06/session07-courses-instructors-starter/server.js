const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// configure a folder for external css stylesheets and images
app.use(express.static("assets"));

// import handlebars
const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// receive data from a <form>
app.use(express.urlencoded({ extended: true }));

/// --------------
// DATABASE : Connecting to database and setting up your schemas/models (tables)
/// --------------

// TODO: Replace this connection string with yours
const mongoose = require("mongoose");

const CONNECTION_STRING =
  "mongodb+srv://dbUser:mIy5cDYJS0YNO7HW@cluster0.8r7oua2.mongodb.net/myDb?retryWrites=true&w=majority&appName=AtlasApp";

mongoose.connect(CONNECTION_STRING);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database: "));
db.once("open", () => {
  console.log("Mongo DB connected successfully.");
});

// Define the schema and models for our collections
// - schema = mongoose collection
// defines

// schemas
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
  title: String,
  code: String,
  taughtBy: String,
});
const InstructorSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
});

// models
const Course = mongoose.model("course_collection", CourseSchema);
const Instructor = mongoose.model("instructor_collection", InstructorSchema);

// ----------------
// endpoints
// ----------------
app.get("/", (req, res) => {
  res.render("index", { layout: false });
});

app.get("/catalogue", async (req, res) => {
  try {
    // display a list of courses
    // gets all Course documents
    const results = await Course.find().lean().exec();
    console.log(results);

    // error handling
    if (results.length === 0) {
      return res.send("ERROR: No courses in database");
    }

    // display results in the UI
    // using a handlebars template:
    // - In your hbs template,
    // write the code to loop through this
    // results array and show
    // Course Code:
    // Course Title:
    // Instructor:

    return res.render("catalog-page", { layout: false, CourseDetail: results });

    // res.send("TODO: Show a list of courses")
  } catch (err) {
    console.log(err);
  }
});

app.post("/lookup", async (req, res) => {
  // get name from form
  const nameFromUI = req.body.instructorName;
  console.log(`DEBUG: Searching for ${nameFromUI}`);

  try {
    // search for instructor by firstname name
    // TODO: you can do a case insensitive search
    // await - if we want to go through the database, we use await and paired it with async
    const results = await Instructor.find({ firstName: nameFromUI })
      .lean()
      .exec();

    if (results.length === 0) {
      return res.send(
        `No instructors found that match the search criteria: ${nameFromUI}`
      );
    }

    // find the courses taught by each instructor LOOP
    let data = [];
    for (instructor of results) {
      const userid = instructor.username;
      const courses = await Course.find({ taughtBy: userid }).lean().exec();

      // build my own custom object that contains information about the
      // instructor and their courses
      const objectToAdd = {
        name: `${instructor.firstName} ${instructor.lastName}`,
        email: instructor.email,
        coursesTaught: courses,
      };

      // add it to the array
      data.push(objectToAdd);
    }

    // send the array to the handlbears temple
    console.log("SEARCH RESULTS");
    console.log(data);

    return res.render("instructor-page", {
      layout: false,
      instructorList: data,
    });

    // return res.send("TODO: Searching for an instructor.")
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

app.post("/enroll", async (req, res) => {
  // get values from form
  console.log(`DEBUG: Form data`);
  console.log(req.body);
  const courseCodeFromUI = req.body.courseCode;
  const useridFromUI = req.body.instructorName

  try {
    // 1. Find the course that you want to modify
    // .find() --> gets all documents and returns an array of objects
    // .findOne() --> get the first document that matches return a single object
    const courseFromDb = await Course.findOne({ code: courseCodeFromUI });

    if (courseFromDb === null) {
      return res.send("ERROR: Could not find matching course");
    }

    // 2. Check if the course has an instructor already
    if (courseFromDb.taughtBy !== "") {
      // the course already has an instructor
      return res.send(
        `ERROR: Course already has an instructor: ${courseFromDb.taughtBy}`
      );
    }
    // return res.send("course found & course has no instructor ");

    // - if yes, quit with error
    // - if no, then try to assign the instructor to the course

    // 3. Find the instructor with the provided userid
    // 3. Search for matching instructor
    const instructorFromDb = await Instructor.findOne({
      username: useridFromUI,
    })
      .lean()
      .exec();

    if (instructorFromDb === null) {
      return res.send(
        `ERROR: Could not find any instructor with specified username`
      );
    }

    // 4. Check if instructor is already teaching the max number of courses
    // Is the instructor already teaching 3 courses?
    const coursesTaught = await Course.find({
      taughtBy: instructorFromDb.username,
    })
      .lean()
      .exec();
    if (coursesTaught.length === 3) {
      return res.send(
        "ERROR: This instructor is already at the max number of courses"
      );
    }
    // - if yes, then quit with error
    // - if no, then assign them

    // 5. If you reach this point, the instructor can be assigned
    const updatedValues = {
      taughtBy: instructorFromDb.username,
    };
    // 6. after updating, save changes
    const finalResult = await courseFromDb.updateOne(updatedValues);
    // TODO :ERROR CHECKING
    return res.send("DONE!!!!!");

    // associate a instructor with a course
    // find the instructor
    // check if they meet the criteria
    // add them to course
    // return res.send("TODO: Assign course to instructor");
  } catch (error) {
    console.error(error);
  }
});

// ----------------
const onHttpStart = () => {
  console.log(`Express web server running on port: ${HTTP_PORT}`);
  console.log(`Press CTRL+C to exit`);
};
app.listen(HTTP_PORT, onHttpStart);

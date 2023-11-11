const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// ----- CONNECT YOUR DATABASE ------

// 1. MongoAtlas connecting string
const mongoose = require("mongoose");
// TODO: Replace this with your mongodb connection string
// The mongodb connection string is in the MongoAtlas web interface
const CONNECTION_STRING =
  "mongodb+srv://dbUser:qPIMFoGQpGmvCm3q@cluster0.8r7oua2.mongodb.net/myDb?retryWrites=true&w=majority&appName=AtlasApp";

mongoose.connect(CONNECTION_STRING);

// check if connection was successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database: "));
db.once("open", () => {
  console.log("Mongo DB connected successfully.");
});

// 2. Write JS code to connect to the database
// put this code AFTER your connection code
// but before your endpoints

//setup your database models
const Schema = mongoose.Schema;
const studentSchema = new Schema({
  name: String,
  username: String,
  tuitionPaid: Boolean,
  gpa: Number,
});
// mongose MODEL object
// - properties & functions to operate on a collection
// - "students" collection
// MongoDb will automatically add a "s" to the end of all your collection names
// & so when you use it programatically, you have to remove that "s"

const Student = mongoose.model("student", studentSchema);

// ----------------------------------

app.get("/", async (req, res) => {
  try {
    //query the database and get everything in the "students" collection
    // .lean().exec()
    // - .lean() - convert the mongoose BSON format into standard javascript objects
    // - .exec() - run the query

    // Example: Search for all students
    const results = await Student.find().lean().exec();

    //Example: Search for all students named “Peter”
    // filter your results - searches students whose name is Peter
    // const results = await Student.find({ "name": "Peter" }).lean().exec();

    // Example: Search for all students with a gpa less than 3
    // search all students whose gpa is less than 3
    // const results = await Student.find({gpa:{$lt:3}}).lean().exec()

    // Example: Search for all students with a gpa greater than and equalts to 3
    // search all students whose gpa is less than 3
    // const results = await Student.find({gpa:{$gte:3}}).lean().exec()

    // Example: Search for all students with tuition paid AND a gpa of 2.5 or greater
    // const results = await Student.find({tuitionPaid:true,gpa:{$gte:2.5}}).lean().exec()

    // results = an array of matching documents
    if (results.length === 0) {
      return res.send("Sorry, there are no matching results");
    } else {
      return res.send(results);
    }
  } catch (err) {
    console.log(err);
    return res.send(err);
  }

  // res.send("HELLO at the / endpoint")
});

//insert data into the collection
app.get("/insert", async (req, res) => {
  // 1. Define the new student you want to insert
  const studentToInsert = new Student({
    name: "Betty",
    username: "betty123",
    tuitionPaid: true,
    gpa: 3.9,
  });

  // 2. Try (Attempt) to insert it
  // - possibility of success, possibility of failure
  try {
    // attempt to execute the code in the try{}
    // .save() --> connect to the database and attempt to insert this document into the collection
    // .save()
    //     --> if your insert was successful, .save() will return a copy of the document that was inserted
    //     --> if your insert didn't work, then .save() will return "null"

    const result = await studentToInsert.save();
    if (result === null) {
      //res.send()
      // return = STOP execution at this point
      // exit the function
      return res.send(`Insert did not work ${result}`);
    } else {
      return res.send(`Done, Check Database! : ${result}`);
    }
  } catch (err) {
    //if there are erros / failure
    // then the code execution will stop and then
    // the code will jump to the catch {} block
    console.log(err); // output the cause of the failure / error
    return res.send(err);
  }
});

// delete from the collection
app.get("/delete", async (req, res) => {
  //attempt
  try {
    // get the document by id that you want to retrieve
    const userToDelete = await Student.findOne({
      _id: "651b6ca51a2f29d2bde229dc",
    });

    //if no matching document can be found, then exit
    if (userToDelete === null) {
      return res.send("Cannot find student with the specified id");
    }

    // after retrieving the document, delete it
    const result = await userToDelete.deleteOne();

    return res.send(`Deleted item is: ${result}`);
  } catch (err) {
    // display error message in browser & console
    console.log(err);
    return res.send(err);
  }
});

// delete student through id
app.get("/deleteWithId/:id", async (req, res) => {
  try {
    const userIdToDelete = await Student.findOne({ _id: req.params.id });

    //if no matching document can be found, then exit
    if (userIdToDelete === null) {
      return res.send("Cannot find student with the specified id");
    }

    // after retrieving the document, delete it
    const result = await userIdToDelete.deleteOne();

    return res.send(`Deleted item is: ${result}`);
  } catch (err) {
    // display error message in browser & console
    console.log(err);
    return res.send(err);
  }
});

// update student datas
app.get("/update", async (req, res) => {
  //attempt to update
  try {
    //1. find the document you want to update
    const studentToUpdate = await Student.findOne({
      _id: "651b6e1dd8d94b37eb5ade2d",
    });

    //if findOne() succeeds, it will contain a document with the appropriate values
    // if findOne()
    // if findOne() fails, it will return {}

    // TODO: cannot find someone with this id
    // you check if findOne == {}

    //cannot find someone with tis id
    if (studentToUpdate === null) {
      return res.send("Cannot find student with this id");
    }

    //2. update the student
    const updatedValues = {
      name: "Betty Jones Smith",
      gpa: 4.0,
      username: "bjsmith",
    };

    // 3. after updating, save changes
    const result = await studentToUpdate.updateOne(updatedValues);

    if (result !== null) {
      console.log(result);
      return res.send(`Record updated!`);
    } else {
      return res.send("Sorry, update failed.");
    }
  } catch (err) {
    return res.send(err);
  }
});

const onHttpStart = () => {
  console.log(`Express web server running on port: ${HTTP_PORT}`);
  console.log(`Press CTRL+C to exit`);
};

app.listen(HTTP_PORT, onHttpStart);

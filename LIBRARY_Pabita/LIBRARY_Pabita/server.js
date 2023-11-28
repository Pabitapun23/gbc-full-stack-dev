const { Double } = require("bson");
const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const session = require("express-session");

// configure a folder for external css stylesheets and images
app.use(express.static("public"));

// import handlebars
const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// receive data from a <form>
app.use(express.urlencoded({ extended: true }));

// configure the express session
app.use(
  session({
    secret: "hello world", // any random string used for configuring the session
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

/// --------------
// DATABASE : Connecting to database and setting up your schemas/models (tables)
/// --------------

const mongoose = require("mongoose");
const { double } = require("webidl-conversions");

const CONNECTION_STRING =
  "mongodb+srv://dbUser:Tzeh3dRKbQffr3xu@cluster0.8r7oua2.mongodb.net/library?retryWrites=true&w=majority&appName=AtlasApp";

mongoose.connect(CONNECTION_STRING);

// check if connection was successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database: "));
db.once("open", () => {
  console.log("Mongo DB connected successfully.");
});

//setup database schema and models
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: String,
  author: String,
  image: String,
  borrowed_by: String,
});
const userSchema = new Schema({
  name: String,
  library_card_number: String,
  phone_number: Number,
});

// model objects
const Book = mongoose.model("books_collection", bookSchema);
const User = mongoose.model("users_collection", userSchema);

//endpoint for homepage
app.get("/", async (req, res) => {
  const bookList = await Book.find().lean().exec();
  res.render("homepage", {
    layout: "my-layout",
    books: bookList,
  });
});

//endpoint to display login page
app.get("/login", (req, res) => {
  res.render("login-page", { layout: "my-layout" });
});

//endpoint for posting login form
app.post("/login", async (req, res) => {
  const libraryCardNumberFromUI = req.body.libraryCardNumber;
  const passwordFromUI = req.body.password;

  try {
    const userDetails = await User.findOne({
      library_card_number: libraryCardNumberFromUI,
    })
      .lean()
      .exec();

    //check if there is any empty input fields
    if (
      libraryCardNumberFromUI === undefined ||
      passwordFromUI === undefined ||
      libraryCardNumberFromUI === "" ||
      passwordFromUI === ""
    ) {
      console.log(
        `Missing Credentials, please enter library card number and password`
      );

      //show error - library number card or password is not provided or retrieved from form
      return res.render("login-page", {
        layout: "my-layout",
        errMsg:
          "Missing Credentials, please enter library card number and password",
      });
    } else if (
      userDetails === undefined ||
      userDetails === "" ||
      userDetails === null
    ) {
      // checks if the datas we are retrieving from user db are empty or not
      // if yes, then, render login page with error msg
      //invalid login
      return res.render("login-page", {
        layout: "my-layout",
        errMsg: "Please enter correct library card number and password",
      });
    }

    // if all the inputs are in valid format
    // compare the credentials with existing users
    // run database query to select any matching user
    //Here, password of users is the last four digits of their phone number 1001001
    const userPassword = userDetails.phone_number.split("-");

    if (passwordFromUI === userPassword[2]) {
      // valid login
      console.log(`Login successful for`);

      // before redirecting user to profile, save any necessary information in session
      req.session.user = userDetails;

      req.session.isLoggedIn = true;

      // after successfully login, user redirected to referer
        return res.redirect(`/profile`);
        
    } else {
      //invalid login
      //show error - library number card or password is no correct
      return res.render("login-page", {
        layout: "my-layout",
        errMsg: "Please enter correct library card number and password",
      });
    }
  } catch (err) {
    console.log(err);
    return res.render("login-page", {
      layout: "my-layout",
      errMsg: "something went wrong",
    });
  }
});

//ensureLogin - this is a middleware function to ensure that the user is logged in
// before they can access profile page
const ensureLogin = (req, res, next) => {
  if (
    req.session.isLoggedIn !== undefined &&
    req.session.isLoggedIn &&
    req.session.user !== undefined
  ) {
    //if user has logged in allow them to go to desired endpoint
    next();
  } else {
    //otherwise, ask them to login first
    return res.render("login-page", {
      errMsg: "You must login first to access profile",
      layout: "my-layout",
    });
  }
};

// endpoint for profile page
app.get("/profile", ensureLogin, async (req, res) => {
  const user = req.session.user;

  try {
    const books = await Book.find({ borrowed_by: user.library_card_number })
      .lean()
      .exec();

    res.render("profile-page", {
      layout: "my-layout",
      user: user,
      bookList: books,
    });
  } catch (err) {
    console.log(err);
    return res.render("login-page", {
      layout: "my-layout",
      errMsg: "something went wrong",
    });
  }
});

//enpoint to borrow book
app.get("/borrow-book/:bookId", async (req, res) => {
  try {
    if (
      req.session.isLoggedIn !== undefined &&
      req.session.isLoggedIn &&
      req.session.user !== undefined
    ) {
      const book = await Book.findOne({ _id: req.params.bookId });

      const finalResult = await book.updateOne({
        borrowed_by: req.session.user.library_card_number,
      });

      return res.redirect("/");
    } else {
      //otherwise, ask them to login first
      return res.render("login-page", {
        errMsg: "You must login first to borrow book",
        layout: "my-layout",
      });
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});

//enpoint for return book
app.get("/return-book/:bookId", async (req, res) => {
  try {
    const updatedValues = await Book.findOne({ _id: req.params.bookId });
    const returnBook = await updatedValues.updateOne({ borrowed_by: "" });
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    return res.redirect("/profile");
  }
});

//endpoint to display logout part
/* logout user - save any data to db
destroy the session
and redirect the user to login page
*/
app.get("/logout", (req, res) => {
  // checks if users are login or not
  if (
    req.session.isLoggedIn !== undefined &&
    req.session.isLoggedIn &&
    req.session.user !== undefined
  ) {
    //destroying the session of logged in user
    req.session.destroy();

    return res.redirect("/login");
  } else {
    return res.send("ERROR: No users logged in");
  }
});

// ----------------
const onHttpStart = () => {
  console.log("The web server has started...");
  console.log(`Express web server running on port: ${HTTP_PORT}`);
  console.log(`Press CTRL+C to exit`);
};
app.listen(HTTP_PORT, onHttpStart);

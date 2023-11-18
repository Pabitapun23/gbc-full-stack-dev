const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const path = require("path");
const { engine } = require("express-handlebars");
const session = require("express-session");

app.use(express.urlencoded({ extended: true }));

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("views", "./views");
app.set("view engine", ".hbs");

// configure the express session
app.use(
  session({
    secret: "terrace cat", // any random string used for configuring the session
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

// Setup a route on the 'root' of the url to redirect to /login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Display the login html page
app.get("/login", function (req, res) {
  res.render("login", { layout: false });
});

// hardcoded user object for authentication
// ideally this should be received from database
// const user = {
//   username: "test1",
//   password: "test1",
//   email: "test1@gmail.com",
//   role: "driver",
// };

// User list for task
const userList = [
  {
    username: "test1",
    password: "test1",
    email: "test1@gmail.com",
    role: "driver",
  },
  {
    username: "test2",
    password: "test2",
    email: "test2@gmail.com",
    role: "passenger",
  },
  {
    username: "test3",
    password: "test3",
    email: "test3@gmail.com",
    role: "driver",
  },
  {
    username: "test4",
    password: "test4",
    email: "test4@gmail.com",
    role: "passenger",
  },
];

app.post("/login", (req, res) => {
  const usernameFromUI = req.body.username;
  const passwordFromUI = req.body.password;
  const userRole = req.body.userType;

  // validate the username and password for valid format
  // generate erro if any
  if (
    usernameFromUI === undefined ||
    passwordFromUI === undefined ||
    usernameFromUI === "" ||
    passwordFromUI === "" ||
    userRole == undefined
  ) {
    console.log(`Missing Credentials`);
    //show error is username or password is not provided or retrieved from form
    return res.render("login", {
      errorMsg: "Missing Credentials",
      layout: false,
    });
  }

  // if all the inputs are in valid format
  // compare the credentials with existing users
  // run database query to select any matching user

  if (
    usernameFromUI === userList.username &&
    passwordFromUI === userList.password &&
    userRole === userList.role
  ) {
    //valid login

    console.log(`Login successful for ${userList.username}`);

    // before redirecting user to dashboard, save any necessary information in session
    req.session.userList = {
      uname: userList.username,
      email: userList.email,
      role: userList.role,
    };

    req.session.isLoggedIn = true;
    req.session.username = userList.username;

    //redirect the user to homepage or dashboard upon successful login
    res.redirect("/dashboard");
  } else {
    //invalid login
    console.log(`Invalid credentials. Please try again!`);
    return res.render("login", {
      errorMsg: `Invalid credentials. Please try again!`,
      layout: false,
    });
  }
});

/* 
logout user
save any data to db
destroy the session
and redirect the user to login page
*/
app.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/login");
});

/*
ensureLogin = a middleware function to ensure that the user is logged in before they can access
any page such as dashboard or profile or view jobs or view rides
*/

const ensureLogin = (req, res, next) => {
  if (
    req.session.isLoggedIn !== undefined &&
    req.session.isLoggedIn &&
    req.session.userList !== undefined
  ) {
    //if user has logged in allow them to go to desired endpoint
    next();
  } else {
    //otherwise, ask them to login first
    return res.render("login", {
      errorMsg: "You must login first to access dashboard",
      layout: false,
    });
  }
};

/*
user should be able to visit the profile page only if they are logged in 
*/
app.get("/profile", ensureLogin, (req, res) => {
  res.send("This is profile page.");
});

/*
user should be able to visit the view-jobs page only if they are logged in as driver
*/
app.get("/view-jobs", ensureLogin, (req, res) => {
  if (req.session.userList.role === "driver") {
    res.send("This is view jobs page.");
  } else {
    res.send("Jobs are only available to drivers.");
  }
});

/*
user should be able to visit the view-rides page only if they are logged in as driver
*/
app.get("/view-rides", ensureLogin, (req, res) => {
  if (req.session.userList.role === "passenger") {
    res.send("This is view rides page.");
  } else {
    res.send("Rides are only available to passengers.");
  }
});

// create a route to take the user to dashboard if they are authenticated
app.get("/dashboard", ensureLogin, (req, res) => {
  if (req.session.userList === undefined) {
    console.log(`Session object for user is undefined`);
  } else {
    console.log(`Session object : ${JSON.stringify(req.session.userList)}`);
  }

  console.log(`session.isLoggedIn: ${req.session.isLoggedIn}`);
  console.log(`session.username: ${req.session.username}`);
  res.render("dashboard", { userList: req.session.userList, layout: false });
});

const onHttpStart = () => {
  console.log(`The web server has started at http://localhost:${HTTP_PORT}`);
  console.log("Press CTRL+C to stop the server.");
};
app.listen(HTTP_PORT, onHttpStart);

/*
 Task - 

 1. Create a view-rides endpoint which should be presented only to passengers if they are logged in.
 2. Create an array userList with multiple user objects with different roles.
 3. Modify the login route to iterate the userList and match credentials with all users.
 4. If valid credentials match, allow the user to visit the dashboard.

 Integrate the database

5. create user account entity in database; this entity will have multiple user objects
6. update the /login to connect with database and
7. check if the credentials provided by the user are correct

 */

const routes = require("./Routes/route");
const session = require("express-session");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const MongoStore = require("connect-mongo");

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "projectName", // Give the project name or the Database Name from MongoDB here
});
const database = mongoose.connection;

database.once("open", async () => {
  console.log("Connected to MongoDB");
});

database.on("error", (error) => {
  console.log(error);
});

app.use(
  express.json(),
  session({
    secret: "projectName", // Give the project name here for the session
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 1000, sameSite: true, secure: true },
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL, /// MongoDb URL
      dbName: "projectName", // Give the project name or the Database Name from MongoDB here
      collection: "session",
      ttl: 5 * 60, /// Max time for each time to expiration
      autoRemove: "native", /// To automatically remove the expired sessions
    }),
    proxy: true,
  })
);

app.use(cors({ credentials: true, origin: true }));

app.use("/path_project_name", routes);

app.listen(3003, () => {
  console.log("App listening at 3003");
});

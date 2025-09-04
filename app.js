const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { PORT } = require("./constants/global");

const errorController = require("./controllers/error");

const { adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("68b778d5d60004f8a998b006")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// 404
app.use(errorController.get404ErrorPage);

mongoose
  .connect(
    "mongodb+srv://Cluster0_user:qxnRkaWyefVXQF9z@cluster0.akw1ynw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

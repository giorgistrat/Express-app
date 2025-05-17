const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const { adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const constants = require("./constants/global");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// 404
app.use(errorController.get404ErrorPage);

app.listen(constants.PORT);

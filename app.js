const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const { adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const { PORT } = require("./constants/global");

const sequelize = require("./utils/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// 404
app.use(errorController.get404ErrorPage);

// define relations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "giorgi",
        email: "giorgi@example.com"
      });
    }
    return user;
  })
  .then((user) => {
    return user.getCart().then((cart) => {
      if (!cart) {
        return user.createCart();
      }
      return cart;
    });
  })
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));

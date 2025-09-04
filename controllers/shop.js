const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", { prods: products, pageTitle: "All Products", path: "/products" });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      console.log("prooduct", product);
      res.render("shop/product-detail", { product, pageTitle: product.title, path: "/products" });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", { prods: products, pageTitle: "Shop", path: "/" });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((products) => {
      console.log("cart products", products);
      res.render("shop/cart", { pageTitle: "Your Cart", path: "/cart", products });
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .deleteCartItemById(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
// };

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrder()
    .then((orders) => {
      console.log("orders", orders);
      res.render("shop/orders", { pageTitle: "Your Orders", path: "/orders", orders });
    })
    .catch((err) => console.log(err));
};

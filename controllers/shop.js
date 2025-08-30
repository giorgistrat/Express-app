const ProductModel = require("../models/product");

exports.getProducts = (req, res) => {
  ProductModel.findAll()
    .then((products) => {
      res.render("shop/product-list", { prods: products, pageTitle: "All Products", path: "/products" });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res) => {
  const prodId = req.params.productId;

  ProductModel.findAll({ where: { id: prodId } })
    .then((products) => {
      res.render("shop/product-detail", { product: products[0], pageTitle: products[0].title, path: "/products" });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  ProductModel.findAll()
    .then((products) => {
      res.render("shop/index", { prods: products, pageTitle: "Shop", path: "/" });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", { pageTitle: "Your Cart", path: "/cart", products });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((products) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  // Logic to add the product to the cart
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;

        return product;
      }

      return ProductModel.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect("/cart");
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        order.addProducts(
          products.map((product) => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then((result) => {
      fetchedCart.setProducts(null); // clear the cart
      res.redirect("/orders");
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log("orders", orders);
      res.render("shop/orders", { pageTitle: "Your Orders", path: "/orders", orders });
    })
    .catch((err) => console.log(err));
};

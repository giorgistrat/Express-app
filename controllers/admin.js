const ProductModel = require("../models/product");

exports.getAddProductsPage = (req, res) => {
  res.render("admin/add-product", { pageTitle: "Add Product", path: "/admin/add-product" });
};

exports.postAddProducts = (req, res, next) => {
  const body = req.body;
  const { title, price, imageUrl, description } = body;

  const product = new ProductModel(title, price, imageUrl, description);
  product.save();

  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  ProductModel.fetchAll((products) => {
    res.render("admin/products", { prods: products, pageTitle: "Admin Products", path: "/admin/products" });
  });
};

const Product = require("../models/product");

exports.getAddProductsPage = (req, res) => {
  res.render("admin/edit-product", { pageTitle: "Add Product", path: "/admin/add-product", editing: false });
};

exports.postAddProducts = (req, res, next) => {
  const body = req.body;
  const { title, price, imageUrl, description } = body;

  const product = new Product(title, price, imageUrl, description, null, req.user._id);
  product.save().then(() => {
    res.redirect("/admin/products");
  });
};

exports.getEditProductsPage = (req, res) => {
  let editMode = req.query.edit;
  editMode = editMode === "true";

  if (!editMode) {
    return res.redirect("/");
  }

  // fetch the product for editing
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        editing: editMode,
        product
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProducts = (req, res, next) => {
  const body = req.body;
  const { id, title, price, imageUrl, description } = body;

  const product = new Product(title, price, imageUrl, description, id);

  product.save();

  res.redirect("/admin/products");
};

exports.postDeleteProducts = (req, res, next) => {
  const id = req.body.id;

  Product.deleteById(id)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", { prods: products, pageTitle: "Admin Products", path: "/admin/products" });
    })
    .catch((err) => console.log(err));
};

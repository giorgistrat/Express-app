const ProductModel = require("../models/product");

exports.getAddProductsPage = (req, res) => {
  res.render("admin/edit-product", { pageTitle: "Add Product", path: "/admin/add-product", editing: false });
};

exports.postAddProducts = (req, res, next) => {
  const body = req.body;
  const { title, price, imageUrl, description } = body;

  req.user
    .createProduct({
      description,
      imageUrl,
      price,
      title,
      userId: req.user.id
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProductsPage = (req, res) => {
  let editMode = req.query.edit;
  editMode = editMode === "true";

  if (!editMode) {
    return res.redirect("/");
  }

  // fetch the product for editing
  const productId = req.params.productId;

  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
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

  ProductModel.findByPk(id)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProducts = (req, res, next) => {
  const id = req.body.id;

  ProductModel.destroy({ where: { id } })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", { prods: products, pageTitle: "Admin Products", path: "/admin/products" });
    })
    .catch((err) => console.log(err));
};

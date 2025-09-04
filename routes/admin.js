const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProductsPage);

// /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProducts);

// /admin/edit-product => GET
router.get("/edit-product/:productId", adminController.getEditProductsPage);

// /admin/edit-product => POST
router.post("/edit-product", adminController.postEditProducts);

// // /admin/delete-product => POST
router.post("/delete-product", adminController.postDeleteProducts);

module.exports = {
  adminRoutes: router
};

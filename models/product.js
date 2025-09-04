const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new ObjectId(String(id)) : null;
    this.userId = userId ? new ObjectId(String(userId)) : null;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      // Update existing product
      dbOp = db.collection("products").updateOne({ _id: this._id }, { $set: this });
    } else {
      // Add new product
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp.then((result) => {}).catch((err) => {});
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();

    if (!ObjectId.isValid(prodId)) {
      throw new Error("Invalid ObjectId");
    }

    return db
      .collection("products")
      .find({ _id: new ObjectId(String(prodId)) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(prodId) {
    const db = getDb();

    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(String(prodId)) })
      .then((result) => {
        console.log("delete Result", result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;

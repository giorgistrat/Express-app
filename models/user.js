const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this.id = id ? new ObjectId(String(id)) : null;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addOrder() {
    const db = getDb();

    return this.getCart()
      .then((products) => {
        const order = {
          products: products,
          user: {
            _id: this.id,
            name: this.name
          }
        };
        return db.collection("orders").insertOne(order);
      })
      .then((_) => {
        this.cart = { items: [] }; // Clear the cart after the order is created
        return db.collection("users").updateOne({ _id: this.id }, { $set: { cart: { items: [] } } });
      });
  }

  getOrder() {
    const db = getDb();

    return db.collection("orders").find({ "user._id": this.id }).toArray();
  }

  getCart() {
    const db = getDb();

    const productIds = this.cart.items.map((i) => i.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => i.productId.toString() === p._id.toString()).quantity
          };
        });
      });
  }

  deleteCartItemById(productId) {
    const updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== productId.toString());
    const db = getDb();
    return db.collection("users").updateOne({ _id: this.id }, { $set: { cart: { items: updatedCartItems } } });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let updatedCartItems = [...this.cart.items];
    let newQuantity = 1;

    if (cartProductIndex >= 0) {
      // Product exists in cart, increment quantity
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      // Product does not exist in cart, add it
      updatedCartItems.push({ productId: product._id, quantity: 1 });
    }

    const updatedCart = { items: updatedCartItems };

    const db = getDb();
    return db.collection("users").updateOne({ _id: this.id }, { $set: { cart: updatedCart } });
  }

  static findById(id) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(String(id)) });
  }
}

module.exports = User;

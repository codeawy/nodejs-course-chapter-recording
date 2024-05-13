import express, { Request, Response } from "express";
import { generateFakeProducts } from "./utils/fakeData";
import { Product } from "./interfaces";
import ProductController from "./controllers/productController";
import ProductService from "./services/ProductService";

const app = express();

app.use(express.json());

const fakeProductsData = generateFakeProducts();

const productService = new ProductService(fakeProductsData);
const productController = new ProductController(productService);

app.get("/products", (req, res) => productController.getProducts(req, res));
app.get("/products/:id", (req, res) => productController.getProductById(req, res));

// ** CREATE A NEW PRODUCT
app.post("/products", (req, res) => {
  const newProduct = req.body;

  fakeProductsData.push({ id: fakeProductsData.length + 1, ...newProduct });

  res.status(201).send({
    id: fakeProductsData.length + 1,
    title: newProduct.title,
    price: newProduct.price,
    description: newProduct.description,
  });
});

// ** UPDATE
app.patch("/products/:id", (req, res) => {
  const productId = +req.params.id;

  if (isNaN(productId)) {
    return res.status(404).send({
      message: "Product not found!",
    });
  }

  const productIndex: number | undefined = fakeProductsData.findIndex(product => product.id === productId);
  const productBody = req.body;

  if (productIndex !== -1) {
    fakeProductsData[productIndex] = { ...fakeProductsData[productIndex], ...productBody };
    return res.status(200).send({
      message: "Product has been updated!",
    });
  } else {
    return res.status(404).send({
      message: "Product not found!",
    });
  }
});

// ** DELETE
app.delete("/products/:id", (req, res) => {
  const productId = +req.params.id;

  if (isNaN(productId)) {
    return res.status(404).send({
      message: "Product not found!",
    });
  }

  const productIndex: number | undefined = fakeProductsData.findIndex(product => product.id === productId);

  if (productIndex !== -1) {
    const filteredProduct = fakeProductsData.filter(product => product.id !== productId);
    res.status(200).send(filteredProduct);
  } else {
    return res.status(404).send({
      message: "Product not found!",
    });
  }
});

const PORT: number = 5000;
app.listen(PORT, () => {
  console.log(`Server running at => http://localhost:${PORT}`);
});

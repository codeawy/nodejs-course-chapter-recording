import express, { Request, Response } from "express";
import { generateFakeProducts } from "./utils/fakeData";

const app = express();

app.get("/", (req, res) => {
  res.send(`<h1>Hello Express.js</h1>`);
});

const fakeProductsData = generateFakeProducts();

// ** Endpoints (PRODUCTS)
app.get("/products", (req, res) => {
  res.send(fakeProductsData);
});
app.get("/products/:id", (req: Request, res: Response) => {
  console.log(req.params);
  const productId = +req.params.id;
  if (isNaN(productId)) {
    res.status(404).send({ message: "Invalid product ID" });
  }

  const findProduct: { id: number; title: string; price: number } | undefined = fakeProductsData.find(
    product => product.id === productId
  );
  if (findProduct) {
    res.send({ id: productId, title: findProduct.title, price: findProduct.price });
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

const PORT: number = 5000;
app.listen(PORT, () => {
  console.log(`Server running at => http://localhost:${PORT}`);
});

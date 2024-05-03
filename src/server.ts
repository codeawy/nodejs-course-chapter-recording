import express, { Request, Response } from "express";
import { generateFakeProducts } from "./utils/fakeData";
import { Product } from "./interfaces";

const app = express();

app.get("/", (req, res) => {
  res.send(`<h1>Hello Express.js</h1>`);
});

const fakeProductsData = generateFakeProducts();

app.get("/products", (req, res) => {
  // ** Filter By, keyof Product
  const filterQuery = req.query.filter as string;

  if (filterQuery) {
    const propertiesToFilter = filterQuery.split(",");

    let filteredProducts = [];

    filteredProducts = fakeProductsData.map(product => {
      const filteredProduct: any = {};
      propertiesToFilter.forEach(property => {
        if (product.hasOwnProperty(property as keyof Product)) {
          filteredProduct[property] = product[property as keyof Product];
        }
      });
      return { id: product.id, ...filteredProduct };
    });

    return res.send(filteredProducts);
  }

  return res.send(fakeProductsData);
});
app.get("/products/:id", (req: Request, res: Response) => {
  console.log(req.params);
  const productId = +req.params.id;
  if (isNaN(productId)) {
    res.status(404).send({ message: "Invalid product ID" });
  }

  const findProduct: Product | undefined = fakeProductsData.find(product => product.id === productId);
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

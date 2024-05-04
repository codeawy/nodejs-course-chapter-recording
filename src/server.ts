import express, { Request, Response } from "express";
import { generateFakeProducts } from "./utils/fakeData";
import { Product } from "./interfaces";

const app = express();

app.use(express.json());

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

const PORT: number = 5000;
app.listen(PORT, () => {
  console.log(`Server running at => http://localhost:${PORT}`);
});

import express from "express";
import path from "path";
import dotenv from "dotenv";
import ProductsViewController from "./controllers/productViewController";
import productsRouter from "./routes/products";
import ProductService from "./services/ProductService";
import { generateFakeProducts } from "./utils/fakeData";
import ErrorMiddleware from "./middlewares/Error";

const app = express();

app.use(express.json());
dotenv.config();

// * Set views directory and engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// * Static file
app.use(express.static(path.join(__dirname, "public")));

const fakeProductsData = generateFakeProducts();

const productService = new ProductService(fakeProductsData);
const productsViewController = new ProductsViewController(productService);

// ** Products Route
app.get("/products", productsViewController.renderProductsList);
app.get("/products/:id", productsViewController.renderProductPage);

// ** Products API Routes
app.use("/api/products", productsRouter);

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "My Store - Home",
  });
});

app.get("*", (req, res) => {
  res.render("notFound", {
    pageTitle: "My Store - Page Not Found",
  });
});

app.use(ErrorMiddleware.handle);

const PORT: number = 5000;
app.listen(PORT, () => {
  console.log(`Server running at => http://localhost:${PORT}`);
});

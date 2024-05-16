import express from "express";
import path from "path";
import { generateFakeProducts } from "./utils/fakeData";
import ProductService from "./services/ProductService";
import ProductController from "./controllers/productController";

const app = express();

app.use(express.json());

// * Set views directory and engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// * Static file
app.use(express.static(path.join(__dirname, "public")));

const fakeProductsData = generateFakeProducts();

const productService = new ProductService(fakeProductsData);
const productController = new ProductController(productService);

// ** Products Route
app.get("/products", (req, res) => productController.renderProductsList(req, res));
app.get("/products/:id", (req, res) => productController.renderProductPage(req, res));
app.get("/api/products", (req, res) => productController.getProducts(req, res));
app.get("/api/products/:id", (req, res) => productController.getProductById(req, res));
app.post("/api/products", (req, res) => productController.createProduct(req, res));
app.patch("/api/products/:id", (req, res) => productController.updateProduct(req, res));
app.delete("/api/products/:id", (req, res) => productController.deleteProduct(req, res));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("*", (req, res) => {
  res.render("notFound");
});

const PORT: number = 5000;
app.listen(PORT, () => {
  console.log(`Server running at => http://localhost:${PORT}`);
});

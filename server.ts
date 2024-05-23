import express from "express";
import 
app.use(compression())helmet from "helmet";
import morgan from "morgan";
import compression  from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import dotenv from "dotenv";
import ProductsViewController from "./controllers/productViewController";
import productsRouter from "./routes/products";
import ProductService from "./services/ProductService";
import { generateFakeProducts } from "./utils/fakeData";
import ErrorMiddleware from "./middlewares/Error";
import NotFoundMiddleware from "./middlewares/NotFound";

const app = express();

dotenv.config();

const rateLimiterOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many requests from this IP, please try again later.",
};

app.use(express.json());
app.use(
  helmet({
    // ! DANGER: DON'T WRITE THIS LINE IN PRODUCTION
    contentSecurityPolicy: false,
    xFrameOptions: {
      action: "deny",
    },
  })
);
app.use(compression())
app.use(morgan("dev"));
app.use(rateLimit(rateLimiterOptions));

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

// ** Middlewares
app.use(NotFoundMiddleware.handle);
app.use(ErrorMiddleware.handle);

const PORT: number = 5000;
app.listen(PORT, () => {
  console.log(`Server running at => http://localhost:${PORT}`);
});

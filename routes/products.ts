import { Router } from "express";
import { generateFakeProducts } from "../utils/fakeData";
import ProductService from "../services/ProductService";
import ProductController from "../controllers/productController";

const productsRouter = Router();

const fakeProductsData = generateFakeProducts();

const productService = new ProductService(fakeProductsData);
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = new ProductController(
  productService
);

productsRouter.route("/").get(getProducts).post(createProduct);
productsRouter.route("/:id").get(getProductById).patch(updateProduct).delete(deleteProduct);

export default productsRouter;

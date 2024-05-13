import ProductService from "../services/ProductService";
import { Product } from "../interfaces";

class ProductController {
  constructor(private productService: ProductService) {}

  getProducts(): Product[] {
    return this.productService.findAll();
  }
}

export default ProductController;

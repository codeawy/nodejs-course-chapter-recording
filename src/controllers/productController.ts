import { ProductsService } from "../services/ProductsService";

class ProductController {
  constructor(private productService: ProductsService) {}

  getProducts() {
    return this.productService.findAll();
  }
}

export default ProductController;

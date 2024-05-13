import { Product } from "../interfaces";

class ProductController {
  // ** Properties
  products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  // ** Methods
  getProducts() {
    // ** Delegate => Logic => Service
    return this.products;
  }
}

export default ProductController;

import ProductService from "../services/ProductService";
import { Request } from "express";
import { Product } from "../interfaces";

class ProductController {
  constructor(private productService: ProductService) {}

  getProducts(req: Request): Product[] {
    const filterQuery = req.query.filter as string;

    if (filterQuery) {
      return this.productService.filterByQuery(filterQuery);
    }
    return this.productService.findAll();
  }
}

export default ProductController;

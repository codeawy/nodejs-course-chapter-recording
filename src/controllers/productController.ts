import ProductService from "../services/ProductService";
import { Request, Response } from "express";
import { Product } from "../interfaces";

class ProductController {
  constructor(private productService: ProductService) {}

  getProducts(req: Request, res: Response) {
    const filterQuery = req.query.filter as string;

    if (filterQuery) {
      return res.send(this.productService.filterByQuery(filterQuery));
    }
    return res.send(this.productService.findAll());
  }

  getProductById(req: Request, res: Response) {
    const productId = +req.params.id;

    if (isNaN(productId)) {
      res.status(404).send({ message: "Invalid product ID" });
    }

    const product: Product | undefined = this.productService.getProductById(productId);

    if (product) {
      res.send({ id: productId, title: product.title, price: product.price });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  }
}

export default ProductController;

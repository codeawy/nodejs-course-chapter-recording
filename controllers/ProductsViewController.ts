import { Request, Response } from "express";
import ProductService from "../services/ProductService";

export default class ProductsViewController {
  constructor(private productService: ProductService) {
    this.renderProductsList = this.renderProductsList.bind(this);
    this.renderProductPage = this.renderProductPage.bind(this);
  }

  renderProductsList(req: Request, res: Response) {
    res.render("products", {
      pageTitle: "Product list 👕",
      description: "This is awesome store",
      products: this.productService.findAll(),
    });
  }

  renderProductPage(req: Request, res: Response) {
    const productId = +req.params.id;

    res.render("product", {
      product: this.productService.getProductById(productId),
    });
  }
}

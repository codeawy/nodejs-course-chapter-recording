import { Request, Response } from "express";
import ProductService from "../services/ProductService";

export default class ProductsViewController {
  constructor(private productService: ProductService) {
    this.renderProductsList = this.renderProductsList.bind(this);
    this.renderProductPage = this.renderProductPage.bind(this);
  }

  renderProductsList(req: Request, res: Response) {
    res.render("products", {
      pageTitle: "My Store - Products Page",
      description: "This is awesome store",
      products: this.productService.findAll(),
    });
  }

  renderProductPage(req: Request, res: Response) {
    const productId = +req.params.id;
    const product = this.productService.getProductById(productId);

    res.render("product", {
      pageTitle: `My Store - ${product?.title}`,
      product,
    });
  }
}

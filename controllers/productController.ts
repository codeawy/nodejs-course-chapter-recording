import ProductService from "../services/ProductService";
import { Request, Response } from "express";
import { Product } from "../interfaces";

class ProductController {
  constructor(private productService: ProductService) {
    this.getProducts = this.getProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  getProducts(req: Request, res: Response) {
    const filterQuery = req.query.filter as string;

    if (filterQuery) {
      res.send(this.productService.filterByQuery(filterQuery));
    }
    res.send(this.productService.findAll());
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
  createProduct(req: Request, res: Response) {
    const productBody = req.body;
    this.productService.createProduct(productBody);

    res.status(201).send({
      id: this.productService.findAll().length + 1,
      title: productBody.title,
      price: productBody.price,
      description: productBody.description,
    });
  }
  updateProduct(req: Request, res: Response) {
    const productId = +req.params.id;

    if (isNaN(productId)) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }

    const productIndex: number | undefined = this.productService
      .findAll()
      .findIndex(product => product.id === productId);
    const productBody = req.body;

    if (productIndex !== -1) {
      this.productService.updateProductByIndex(productIndex, productBody);

      return res.status(200).send({
        message: "Product has been updated!",
      });
    } else {
      return res.status(404).send({
        message: "Product not found!",
      });
    }
  }

  deleteProduct(req: Request, res: Response) {
    const productId = +req.params.id;

    if (isNaN(productId)) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }

    const productIndex: number | undefined = this.productService
      .findAll()
      .findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      const filteredProduct = this.productService.deleteProduct(productId);
      res.status(200).send(filteredProduct);
    } else {
      return res.status(404).send({
        message: "Product not found!",
      });
    }
  }
}

export default ProductController;

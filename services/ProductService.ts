import { Request } from "express";
import { Product } from "../interfaces";

type ProductBody = {
  title: string;
  price: number;
  description: string;
};
export default class ProductService {
  constructor(private products: Product[]) {
    this.products = products;
  }

  findAll(): Product[] {
    return this.products;
  }
  filterByQuery(filterQuery?: string) {
    if (filterQuery) {
      const propertiesToFilter = filterQuery.split(",");
      let filteredProducts = [];
      filteredProducts = this.findAll().map(product => {
        const filteredProduct: any = {};
        propertiesToFilter.forEach(property => {
          if (product.hasOwnProperty(property as keyof Product)) {
            filteredProduct[property] = product[property as keyof Product];
          }
        });
        return { id: product.id, ...filteredProduct };
      });
      return filteredProducts;
    }

    return this.findAll();
  }
  getProductById(productId: number) {
    return this.findAll().find(product => product.id === productId);
  }
  createProduct(productBody: ProductBody) {
    return this.findAll().push({ id: this.findAll().length + 1, ...productBody });
  }
  updateProductByIndex(index: number, productBody: ProductBody) {
    return (this.findAll()[index] = { ...this.findAll()[index], ...productBody });
  }
  deleteProduct(id: number) {
    return this.findAll().filter(product => product.id !== id);
  }
}

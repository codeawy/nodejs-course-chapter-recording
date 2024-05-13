import { Product } from "../interfaces";
import { generateFakeProducts } from "../utils/fakeData";

// * Service => data storage and retrieval
const fakeProductsData = generateFakeProducts();

export class ProductsService {
  private readonly products: Product[] = fakeProductsData;

  findAll() {
    return this.products;
  }
}

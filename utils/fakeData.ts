import { faker } from "@faker-js/faker";
import { Product } from "../interfaces";

export const generateFakeProducts = (): Product[] => {
  return Array.from({ length: 10 }, (_, idx) => {
    return {
      id: idx + 1,
      title: faker.commerce.productName(),
      price: +faker.commerce.price({ min: 100, max: 200 }),
      description: faker.commerce.productDescription(),
      imageURL: faker.image.urlPicsumPhotos(),
    };
  });
};

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: Date;
}

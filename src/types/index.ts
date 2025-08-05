export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  featured?: boolean;
  bestseller?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  location: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CustomOrderData {
  name: string;
  email: string;
  number: string;
  designDetails: string;
  file?: FileList;
}
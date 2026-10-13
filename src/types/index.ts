export interface GalleryItem {
  id: number | string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface Testimonial {
  id: number | string;
  name: string;
  text: string;
  rating: number;
  location?: string;
}

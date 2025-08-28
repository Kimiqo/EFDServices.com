export type GalleryItem = {
  id: number | string;
  title: string;
  category: string;
  image: string;
  description: string;
};

export type Testimonial = {
  id: number | string;
  name: string;
  text: string;
  rating: number;
  location?: string;
};

export type Design = {
  id: string;
  name: string;
  image: string;
  front: string;
  back: string;
  category: string;
  createdAt: string;
};

export type DesignCreate = {
  name: string;
  category: string;
  createdAt: string;
};

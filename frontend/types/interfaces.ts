interface FormData {
  username: string;
  email: string;
  role: string;
  address: string;
  password: string;
  confirm_password: string;
}

interface FormDataLogin {
  email: string;
  password: string;
}

interface ButtonProps {
  type: "button" | "submit" | "reset";
  value: string;
  onClick?: () => void;
  additionalStyle?: string;
}

interface CategoryResponse {
  _id: string;
  categoryName: string;
  file: string;
}

interface ItemResponse {
  banner: string;
  categoryID: string;
  createdAt: string;
  description: string;
  files: string[];
  price: number;
  title: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

interface CartItems {
  itemID: string;
  quantity: number;
  cost: number;
  _id: string;
}

interface CartResponse {
  _id: string;
  userID: string;
  items: CartItems[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Author {
  _id: string;
  username: string;
  email: string;
}

interface BlogResponse {
  _id: string;
  title: string;
  content: string;
  banner: string;
  author: Author;
  updatedAt: string;
}

interface PriceSliderProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

export type {
  FormData,
  FormDataLogin,
  ButtonProps,
  CategoryResponse,
  BlogResponse,
  ItemResponse,
  CartResponse,
  PriceSliderProps
};

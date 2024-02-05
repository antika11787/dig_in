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

type ItemResponse = {
  banner?: string;
  categoryID?: string;
  description?: string;
  files?: string[];
  price?: number;
  title?: string;
  _id?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  quantity?: number;
  cost?: number;
} & { itemID?: string };

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

interface MyCartResponse {
  _id: string;
  userID: string;
  items: ItemResponse[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AddToCartResponse {
  itemID?: string;
  quantity?: number;
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

interface DropdownProps {
  title?: string;
  options?: { value: string; label: string }[];
  selectedOption?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface UserState {
  email: string;
  token: string;
  role: string;
  isVerified: boolean;
}

export type {
  FormData,
  FormDataLogin,
  ButtonProps,
  CategoryResponse,
  BlogResponse,
  ItemResponse,
  CartResponse,
  AddToCartResponse,
  PriceSliderProps,
  DropdownProps,
  UserState,
  MyCartResponse,
};

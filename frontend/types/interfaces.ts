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
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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

interface CartState {
  cart: {
    numberOfItems: number;
  };
}

interface updateContentState {
  content: {
    contentLength: number;
  };
}

interface AddressData {
  house: string;
  area: string;
  street: string;
}

interface ProfileInfo {
  username: string;
  email: string;
  address: string;
  role: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCategoryForm {
  _id?: string;
  categoryName?: string;
  file?: File | null;
}

interface CreateUserForm {
  _id?: string;
  username: string;
  address: string;
  role: string;
}

interface CreateBlogForm {
  _id?: string;
  title?: string;
  content?: string;
  banner?: File | null;
  tags?: string;
}

interface UserResponse {
  _id: string;
  email: string;
  username: string;
  role: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
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
  AddressData,
  CartState,
  updateContentState,
  ProfileInfo,
  CreateCategoryForm,
  UserResponse,
  CreateUserForm,
  CreateBlogForm,
};

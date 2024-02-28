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
  categoryID?: {
    _id?: string;
    categoryName?: string;
    file?: string;
  };
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
  tags: string[];
  banner: string;
  author: Author;
  updatedAt: string;
  createdAt: string;
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
  className?: string;
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
  phone: string;
}

interface ProfileInfo {
  username: string;
  email: string;
  address: string;
  role: string;
  isAuthorVerified: boolean;
  isVerified: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCategoryForm {
  _id?: string;
  categoryName?: string;
  file?: File | null;
}

interface CreateItemForm {
  _id?: string;
  title: string;
  description: string;
  price: string;
  categoryID: string;
  files: File[] | null;
  banner: number | null;
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
  tags?: string;
  banner?: File | null;
}

interface UserResponse {
  isAuthorVerified: boolean;
  isVerified: boolean;
  _id: string;
  email: string;
  username: string;
  role: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ItemForOrder {
  itemID: {
    _id: string;
    title: string;
    banner: string;
  };
  quantity: number;
  cost: number;
  _id: string;
}

interface OrderResponse {
  _id: string;
  userID: {
    username: string;
    email: string;
  };
  items: ItemForOrder[];
  house: string;
  street: string;
  area: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FilterType {
  price?: { $gte?: number | undefined; $lte?: number | undefined } | undefined;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

interface InputFieldProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
}

interface TextareaProps {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  name: string;
}

interface SelectOptionProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  name?: string;
  label?: string;
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
  CreateItemForm,
  OrderResponse,
  FilterType,
  InputFieldProps,
  TextareaProps,
  SelectOptionProps,
};

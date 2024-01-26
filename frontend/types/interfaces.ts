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

export type { FormData, FormDataLogin };

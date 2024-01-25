interface CustomImportMeta extends ImportMeta {
    env: {
      VITE_SERVER_URL: string;
    };
  }

interface FormData {
    username: string;
    email: string;
    role: string;
    address: string;
    password: string;
    confirm_password: string;
};

export type {FormData, CustomImportMeta};
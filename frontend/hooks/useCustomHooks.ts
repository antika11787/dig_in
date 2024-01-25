import { useCallback } from "react";
import { SignupApi } from "@/apiEndpoints/auth";
import { FormData } from "@/types/interfaces";
import toast from "react-toastify";

const useCustomHooks = () => {
  const signup = useCallback(async (formData: FormData) => {
    try {
      await SignupApi(formData);
      // Optionally, update the user state or perform other actions
    } catch (error: any) {
      (toast as any).error(
        error.message || "An unknown error occurred during signup"
      );
    }
  }, []);

  return {
    signup,
  };
};

export default useCustomHooks;

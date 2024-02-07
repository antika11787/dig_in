"use client";

import "./index.scss";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ClearCartApi, PaymentSuccessApi } from "@/apiEndpoints/cart";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
     ClearCartApi();
  }, []);

  return (
    <div className="payment-success-wrapper">
      <div className="payment-success-container">
        <img src="/checked.png" className="payment-success-image" />
        <h1 className="payment-success-title">Payment Successful!</h1>
        <button
          className="continue-shopping-button"
          onClick={() => {
            router.push("/items");
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

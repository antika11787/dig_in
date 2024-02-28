"use client";

import "./index.scss";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ClearCartApi, PaymentSuccessApi } from "@/apiEndpoints/cart";
import Image from "next/image";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
     ClearCartApi();
  }, []);

  return (
    <div className="payment-success-wrapper">
      <div className="payment-success-container">
        <Image src="/checked.png" alt="payment success" width={100} height={100} className="payment-success-image" />
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

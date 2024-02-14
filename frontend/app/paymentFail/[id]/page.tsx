"use client";

import "./index.scss";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ClearCartApi } from "@/apiEndpoints/cart";

const PaymentFailPage = () => {
    const router = useRouter();
    const { id } = useParams();

    return (
        <div className="payment-success-wrapper">
            <div className="payment-success-container">
                <img src="/cancel.png" className="payment-success-image" />
                <h1 className="payment-success-title">Payment Failed!</h1>
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

export default PaymentFailPage;

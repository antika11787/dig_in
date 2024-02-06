import CartItems from "@/components/blocks/cartItems";
import Checkout from "@/components/blocks/checkout"

const CheckoutPage = () => {
    return (
        <div className="checkout-page">
            <Checkout />
            <CartItems />
        </div>
    )
}

export default CheckoutPage;

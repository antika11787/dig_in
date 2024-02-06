'use client';

import './index.scss';
import { useRouter } from 'next/navigation';

const PaymentSuccessPage = () => {
    const router = useRouter();

    return (
        <div className='payment-success-wrapper'>
            <div className='payment-success-container'>
            <img src="/checked.png" className='payment-success-image' />
            <h1 className='payment-success-title'>Payment Successful!</h1>
            <button className='continue-shopping-button'
            onClick={()=>{
                router.push('/items');
            }}>Continue Shopping</button>
        </div>
        </div>
    )
}

export default PaymentSuccessPage;

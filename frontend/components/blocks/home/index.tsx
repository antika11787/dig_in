'use client';

import { useDispatch } from "react-redux";
import { removeLogin } from "@/redux/slices/UserSlice";
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const logout = () => {
        dispatch(removeLogin());
        router.push('/login');
    }
    return (
        <div>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default HomePage;

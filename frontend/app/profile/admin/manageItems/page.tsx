'use client';

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import ManageItems from "@/components/blocks/manageItems";


const ManageItemsPage = () => {
    const router = useRouter();
    const role = useSelector((state: any) => state.user.role);
    if (role !== "admin") {
        return router.push("/unauthorized");
    }
    return (
        <ManageItems />
    )
}

export default ManageItemsPage;

'use client';

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import ManageCategory from "@/components/blocks/manageCategory";

const ManageCategoryPage = () => {
    const router = useRouter();
    const role = useSelector((state: any) => state.user.role);
    if (role !== "admin") {
        return router.push("/unauthorized");
    }
    return (
        <div>
            <ManageCategory />
        </div>
    )
}

export default ManageCategoryPage;

'use client';

import ManageBlogs from "@/components/blocks/manageBlogs";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ManageBlogsPage = () => {
    const router = useRouter();
    const role = useSelector((state: any) => state.user.role);
    if (role !== "admin") {
        return router.push("/unauthorized");
    }
    return (
        <ManageBlogs />
    )

}

export default ManageBlogsPage;

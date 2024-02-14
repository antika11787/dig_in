'use client';

import SideBar from "@/components/layout/sidebar";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";

const ProfileLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="profile-wrapper">
            <SideBar />
            <div className="profile-body">
                {children}
            </div>
        </div>
    );
};

export default ProfileLayout;

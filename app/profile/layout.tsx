'use client';

import SideBar from "@/components/layout/sidebar";

const ProfileLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="profile-wrapper">
            <div className="profile-sidebar">
                <SideBar />
            </div>
            <div className="profile-body">
                {children}
            </div>
        </div>
    );
};

export default ProfileLayout;

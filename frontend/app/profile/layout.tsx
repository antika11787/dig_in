import SideBar from "@/components/layout/sidebar";

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

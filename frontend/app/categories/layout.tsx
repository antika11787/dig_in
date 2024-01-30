import CategoryList from "@/components/layout/categoryList";

const CategoryLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <div className="category-wrapper">
            <CategoryList />
            <div className="category-body">
                {children}
            </div>
        </div>
    );
};

export default CategoryLayout;

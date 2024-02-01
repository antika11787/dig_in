import ItemFilter from "@/components/layout/itemFilter";

const ItemsLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        // <div className="item-wrapper">
        //     <div className="item-filter">
        //         <ItemFilter />
        //     </div>
            <div className="item-body">
                {children}
            </div>
        // </div>
    );
};

export default ItemsLayout;

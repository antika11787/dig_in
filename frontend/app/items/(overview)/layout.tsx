const ItemsLayout = ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <div className="item-body">
            {children}
        </div>
    );
};

export default ItemsLayout;

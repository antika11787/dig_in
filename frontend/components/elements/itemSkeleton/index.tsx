import "./index.scss";

const ItemSkeleton = () => {

    return (
        <div className='item-card'>
            <div className="item-banner"></div>
            <div className='item-details'>
                <div className='item-title-cart'>
                    <div className='item-title'></div>
                    <div className="cart-icon"></div>
                </div>
                <div className='item-description'></div>
                <div className='item-price'></div>
            </div>
        </div>
    );
};

export default ItemSkeleton;

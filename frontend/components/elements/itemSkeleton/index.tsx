import "./index.scss";

const ItemSkeleton = () => {

    return (
        <div className='skeleton-item-card'>
            <div className="skeleton-item-banner"></div>
            <div className='skeleton-item-details'>
                <div className='skeleton-item-title-cart'>
                    <div className='skeleton-item-title'></div>
                    <div className="skeleton-cart-icon"></div>
                </div>
                <div className='skeleton-item-description'></div>
                <div className='skeleton-item-price'></div>
            </div>
        </div>
    );
};

export default ItemSkeleton;

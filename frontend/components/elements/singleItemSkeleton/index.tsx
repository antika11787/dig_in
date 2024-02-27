import './index.scss';

const SingleItemSkeleton = () => {
    return (
        <div className='skeleton-container-single-item'>
            <div className='skeleton-banner'></div>
            <div className='skeleton-details'>
                <div className='skeleton-title'></div>
                <div className='skeleton-description'></div>
                <div className='skeleton-description'></div>
                <div className='skeleton-price'></div>
            </div>
        </div>
    );
};

export default SingleItemSkeleton;

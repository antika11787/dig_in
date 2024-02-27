'use client';

import PriceSlider from '@/components/elements/slider';
import './index.scss';

const ItemFilter = () => {
    const handlePriceChange = (min: number, max: number) => {
        console.log('Price range changed:', min, max);
    };

    return (
        <div className='filter-container'>
            <h3 className='filter-text'>Filters </h3>
            {/* <PriceSlider min={0} max={100} onChange={handlePriceChange} /> */}
        </div>
    )
}

export default ItemFilter;

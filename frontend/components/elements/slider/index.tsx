import 'react-input-range/lib/css/index.css';
import './index.scss'
import InputRange from 'react-input-range';

const PriceRangeSlider = ({ priceRange, setPriceRange }: { priceRange: number, setPriceRange: Function }) => {
    return (
        <div className="slider">
            <label>Price Range:</label>
            <InputRange
                maxValue={1000}
                minValue={0}
                value={priceRange}
                onChange={value => setPriceRange(value)}
            />
        </div>
    );
};

export default PriceRangeSlider;
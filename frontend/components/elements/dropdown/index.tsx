import './index.scss';
import { DropdownProps } from "@/types/interfaces";

const Dropdown = ({ title, options, selectedOption, onChange }: DropdownProps) => {
    const defaultOption = { value: '', label: 'Sort Items' };
    const updatedOptions = options ? [defaultOption, ...options] : [defaultOption];

    return (
        <div className="dropdown-container">
            {/* <label>{title}</label> */}
            <select
                value={selectedOption}
                onChange={onChange}
                className="dropdown-menu">
                {updatedOptions.map((option) => (
                    <option key={option.value} value={option.value} className="dropdown-item">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;

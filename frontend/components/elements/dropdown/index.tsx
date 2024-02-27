import './index.scss';
import { DropdownProps } from "@/types/interfaces";

const Dropdown = ({ title, options, selectedOption, onChange, className }: DropdownProps) => {
    const defaultOption = { value: '', label: 'Sort Items', disabled: true };
    const updatedOptions = options ? [defaultOption, ...options] : [defaultOption];

    return (
        <div className="dropdown-container">
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

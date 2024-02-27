import { ChangeEventHandler } from "react";
import { IoIosSearch } from "react-icons/io";
import "./index.scss";

const Search = ({
  type,
  placeholder,
  value,
  onChange,
  className,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}) => {
  return (
    <div className="searchbar-container">
      <div className="search-input-container">
        <input
          className="search-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <IoIosSearch className="search-icon" />
      </div>
    </div>
  );
};

export default Search;

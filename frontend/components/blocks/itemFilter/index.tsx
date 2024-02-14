"use client";
import React, { use } from "react";
import "./index.scss";
import RangeSlider from "../../elements/rangeSlider";
import { useState, useEffect } from "react";
import Checkbox from "../../elements/checkbox";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { CategoryResponse } from "@/types/interfaces";

type Props = {
  setFilter: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
};

const FoodFilter = (props: Props) => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({
    price: [],
    category: [],
    tags: [],
  });

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {

    GetCategoriesApi().then((response) => {
      setCategories(response);
    });

  }, []);

  useEffect(() => {

   props.setFilter(selectedFilters);
    
  }, [selectedFilters]);

  const handleFilterChange = (filter: string, value: string) => {
    if (selectedFilters[filter].includes(value)) {
      setSelectedFilters({
        ...selectedFilters,
        [filter]: selectedFilters[filter].filter((item) => item !== value),
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [filter]: [...selectedFilters[filter], value],
      });
    }
  };

  return (
    <>
    <div className="filter">
      <div className="filter__card">
        <p className="filter__heading">Price Range</p>
        <div className="filter__slider">
          <RangeSlider
            min={0}
            max={1000}
            step={1}
            onChange={(range:number[]) => {
              setSelectedFilters({
                ...selectedFilters,
                price: range.map(String),
              });
            }}
          />
        </div>
      </div>

      <div className="filter__card">
        <p className="filter__heading">Categories</p>
        <div className="filter__options">
          {categories.map((category) => (
            <Checkbox
              key={category._id}
              text={category.categoryName}
              display="block"
              onChange={() => {
                handleFilterChange("category", category._id);
              }}
            />
          ))}
        </div>
      </div>

      <div className="filter__card">
        <p className="filter__heading">Tags</p>
        <div className="filter__options">
          {tags.map((tag) => (
            <Checkbox
              key={tag}
              text={tag}
              display="block"
              onChange={() => {
                handleFilterChange("tags", tag);
              }}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default FoodFilter;

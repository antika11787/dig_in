'use client';

import { useEffect, useState } from "react";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { CategoryResponse } from "@/types/interfaces";
import Link from "next/link";
import './index.scss';

const CategoryList = () => {
    const [categoryList, setCategoryList] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        GetCategoriesApi().then((response) => {
            setCategoryList(response);
        })
    }, []);

    return (
        <div className="category-container">
            <h3 className="category-title">Categories</h3>
            {categoryList.map((category) => (
                <div className="category-card" key={category._id}>
                    <Link className="category-link" href={`/categories/${category._id}`}>
                        <p>{category.categoryName}</p>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default CategoryList;

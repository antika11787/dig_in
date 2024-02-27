"use client";

import Search from "@/components/elements/search";
import { useState, useEffect, ChangeEvent } from "react";
import {
  GetAllItemsApi,
  GetItemByIdApi,
} from "@/apiEndpoints/item";
import {
  CategoryResponse,
  ItemResponse,
} from "@/types/interfaces";
import { RiFileEditFill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { updateContentState } from "@/types/interfaces";
import { GetCategoriesApi } from "@/apiEndpoints/category";
import { useRouter } from "next/navigation";
import "./index.scss";
import appConfig from "@/config/constants";
import CreateItemModal from "../modals/createItemModal";
import EditItemModal from "../modals/editItemModal";
import DeleteItemModal from "../modals/deleteItemModal";
import Image from "next/image";
import Pagination from "@/components/elements/pagination";
import ItemSkeleton from "@/components/elements/itemSkeleton";
import CmsSkeleton from "@/components/elements/cmsSkeleton";

const ManageItems = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const contentLength = useSelector(
    (state: updateContentState) => state.content.contentLength
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editModalItem, setEditModalItem] = useState<ItemResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [itemID, setItemID] = useState<string>("");
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(1);
  const [sortParam, setSortParam] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<{ [key: string]: string[] }>({
    price: [],
    category: [],
    tags: [],
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openDeleteModal = (itemID: string) => {
    setItemID(itemID);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (itemID: string) => {
    setItemID(itemID);
    GetItemByIdApi(itemID).then((response) => {

      setEditModalItem(response);
    });
  };

  useEffect(() => {
    GetCategoriesApi()
      .then((response) => {
        setCategories(response);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    GetAllItemsApi(searchQuery, filter, limit, currentPage)
      .then((response) => {
        setItems(response.items);
        setTotalRecords(response.totalRecords);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setItems([]);
        setLoading(false);
      });
  }, [contentLength, dispatch, currentPage, searchQuery, limit]);

  return (
    <div className="manage-items-container">
      <div className="manage-items-header">
        <CreateItemModal
          isModalOpen={isModalOpen}
          imageIndex={imageIndex}
          searchQuery={searchQuery}
          categories={categories}
          setIsModalOpen={setIsModalOpen}
          setImageIndex={setImageIndex}
          setItems={setItems}
        />
        <h3 className="manage-items-title">Manage Items</h3>
        <Search
          type="text"
          placeholder="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="create-items-button" onClick={openModal}>
          Create Item
        </button>
      </div>
      <div className="manage-items-body">
        <div className="manage-items-card-table-header">
          <p className="manage-items-card-table-name">Name</p>
          <p className="manage-items-card-table-category">Category</p>
          <p className="manage-items-card-table-price">Price</p>
          <p className="manage-items-card-table-action">Action</p>
        </div>
        {loading ? (
          [...Array(6)].map((_, index) => (
            <CmsSkeleton key={index} />
          ))
        ) :
          items && items.length > 0 ? (
            items.map((item) => {
              return (
                <div key={item._id} className="manage-items-card">
                  <div className="manage-items-card-table">
                    <div className="manage-items-image-title">
                      <Image
                        src={`${appConfig.nextPublicApiBaseUrl}/uploads/${item.banner}`}
                        alt="item"
                        width={100}
                        height={100}
                        className="manage-items-image"
                        onClick={() => {
                          router.push(`/items/${item._id}`);
                        }}
                      />
                      <p className="manage-items-name">{item.title}</p>
                    </div>
                    <p className="manage-items-category">
                      {item.categoryID?.categoryName}
                    </p>
                    <p className="manage-items-price">BDT {item.price}</p>
                  </div>
                  <div className="manage-items-button">
                    <EditItemModal
                      isEditModalOpen={isEditModalOpen}
                      setIsEditModalOpen={setIsEditModalOpen}
                      editModalItem={editModalItem}
                      imageIndex={imageIndex}
                      searchQuery={searchQuery}
                      itemID={itemID}
                      categories={categories}
                      setItems={setItems}
                      setEditModalItem={setEditModalItem}
                      setImageIndex={setImageIndex}
                    />
                    <RiFileEditFill
                      className="edit-button"
                      onClick={() => {
                        setIsEditModalOpen(true);
                        openEditModal(item?._id ?? "");
                      }}
                    />
                    <DeleteItemModal
                      isDeleteModalOpen={isDeleteModalOpen}
                      items={items}
                      itemID={itemID}
                      setIsDeleteModalOpen={setIsDeleteModalOpen}
                      setItems={setItems} />
                    <AiFillDelete
                      className="delete-button"
                      onClick={() => {
                        openDeleteModal(item?._id ?? "");
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div>No items found</div>
          )}
        <div className="item-pagination">
          <Pagination
            itemsPerPage={limit}
            totalItems={totalRecords}
            setPage={setCurrentPage}
          />
        </div>
      </div>

    </div>
  );
};

export default ManageItems;

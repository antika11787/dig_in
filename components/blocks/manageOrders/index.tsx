'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { GetAllOrdersApi, GetOrderByIdApi, SetStatusApi } from '@/apiEndpoints/cart';
import { OrderResponse } from '@/types/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { updateContentState } from '@/types/interfaces';
import { FiEye } from 'react-icons/fi';
import { CgCloseR } from 'react-icons/cg';
import Modal from 'react-modal';
import Image from 'next/image';
import helper from '@/utils/helper';
import './index.scss';
import Dropdown from '@/components/elements/dropdown';
import appConfig from '@/config/constants';
import CmsSkeleton from '@/components/elements/cmsSkeleton';

const ManageOrders = () => {
    const dispatch = useDispatch();
    const { formatTimeAgo } = helper();
    const contentLength = useSelector(
        (state: updateContentState) => state.content.contentLength
    )
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [orderId, setOrderId] = useState<string>("");
    const [singleOrder, setSingleOrder] = useState<OrderResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [sortParam, setSortParam] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const handleSortParam = (e: ChangeEvent<HTMLSelectElement>) => {
        setSortParam(e.target.value);
    };

    const openModal = (orderId: string) => {
        setOrderId(orderId);
        GetOrderByIdApi(orderId).then((response) => {
            console.log("response from GetOrderByIdApi", response);
            setSingleOrder(response);

        })
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        GetAllOrdersApi(sortParam).then((response) => {
            setOrders(response);
            dispatch(
                saveContentLength({ contentLength: response?.length || 0 })
            );
            setLoading(false);
        })
            .catch((error) => {
                console.error("Error fetching items:", error);
                setOrders([]);
                setLoading(false);
            });
    }, [contentLength, sortParam, dispatch]);

    return (
        <div className="manage-orders-container">
            <div className="manage-orders-header">
                <h3 className='manage-orders-title'>Manage Orders</h3>
                <div className="manage-orders-sort">
                    <Dropdown
                        title="Sort by"
                        options={[
                            { value: "updatedAtAsc", label: "Oldest" },
                            { value: "updatedAtDesc", label: "Newest" },
                        ]}
                        selectedOption={sortParam}
                        onChange={handleSortParam}

                    />
                </div>
            </div>
            <div className="manage-orders-body custom-scrollbar">
                <div className="manage-orders-card-table-header">
                    <p className="manage-orders-card-table-title">Customer</p>
                    <p className="manage-orders-card-table-length">Items</p>
                    <p className="manage-orders-card-table-date">Time</p>
                    <p className="manage-orders-card-table-status">Status</p>
                    <p className="manage-orders-card-table-action">Action</p>
                </div>
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <CmsSkeleton key={index} />
                    ))
                ) :
                    orders && orders.length > 0 ? (
                        orders.map((order) => {
                            return (
                                <div className="manage-orders-card" key={order._id}>
                                    <div className='manage-orders-img-details'>
                                        <Image src={'/order.png'} alt="order image" width={50} height={50} className='manage-orders-img' />
                                        <p className='manage-orders-card-customer'>{order.userID.username}{" "}</p>
                                    </div>
                                    <p className='manage-orders-card-length'>{order.items.length}</p>
                                    <p className='manage-orders-card-date'>{formatTimeAgo(order.createdAt)}</p>
                                    <div className='manage-orders-card-actions'>
                                        <p className={`manage-orders-card-status ${order.status}`}>{order.status}</p>
                                    </div>
                                    <button type="button"
                                        className='eye-button' onClick={() => openModal(order._id)}><FiEye />
                                    </button>
                                    <Modal
                                        isOpen={isModalOpen}
                                        onRequestClose={closeModal}
                                        ariaHideApp={false}
                                        contentLabel="Example Modal"
                                        style={{
                                            overlay: {
                                                backgroundColor: "rgba(0, 0, 0, 0.2)",
                                            },
                                            content: {
                                                width: "50%",
                                                height: "60%",
                                                margin: "auto",
                                                borderRadius: "10px",
                                                overflow: "auto",
                                            },
                                        }}
                                    >
                                        <div className='modal-content-container'>
                                            <div className='modal-content'>
                                                <h3 className='modal-card-title'>Ordered items</h3>
                                                {singleOrder && singleOrder.items && singleOrder.items.length > 0 ? (
                                                    singleOrder.items.map((item) => (
                                                        <div key={item._id} className='modal-card'>
                                                            <Image src={`${appConfig.nextPublicApiBaseUrl}/uploads/${item.itemID.banner}`} alt="product image" width={200} height={200} className='modal-img' />
                                                            <div className='modal-card-details'>
                                                                <p className='modal-card-title'>{item.itemID.title}<span className='modal-card-quantity'>{" x "}{item.quantity}</span></p>
                                                                <p className='modal-card-cost'>Cost: BDT {item.cost}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No items found</p>
                                                )}

                                            </div>
                                            <div className='modal-card-status-container'>
                                                <select className='modal-card-status'
                                                    defaultValue={selectedStatus}
                                                    onChange={(e) => {
                                                        console.log(e.target.value)
                                                        SetStatusApi(orderId, e.target.value);
                                                        setSelectedStatus(e.target.value);
                                                        dispatch(saveContentLength({ contentLength: -1 }));
                                                        setIsModalOpen(false);
                                                    }}>
                                                    <option value="" className='modal-card-status-option' disabled={true}>Set Status</option>
                                                    <option value="Pending" className='modal-card-status-option'>Pending</option>
                                                    <option value="In-progress" className='modal-card-status-option'>In progress</option>
                                                    <option value="Delivered" className='modal-card-status-option'>Delivered</option>
                                                </select>
                                            </div>
                                        </div>
                                        <CgCloseR className="close-button" onClick={closeModal} />
                                    </Modal>
                                </div>
                            )
                        })
                    ) : (
                        <div>No orders found</div>
                    )}
            </div>
        </div>
    )
}

export default ManageOrders;

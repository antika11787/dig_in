'use client';

import './index.scss';
import { useEffect, useState } from 'react';
import { GetMyOrdersApi, GetOrderByIdApi } from '@/apiEndpoints/cart';
import { OrderResponse } from '@/types/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { saveContentLength } from '@/redux/slices/ContentSlice';
import { updateContentState } from '@/types/interfaces';
import { FiEye } from 'react-icons/fi';
import { CgCloseR } from 'react-icons/cg';
import Modal from 'react-modal';
import Image from 'next/image';
import helper from '@/utils/helper';

const MyOrders = () => {
    const dispatch = useDispatch();
    const { formatTimestamp } = helper();
    const contentLength = useSelector(
        (state: updateContentState) => state.content.contentLength
    )
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [orderId, setOrderId] = useState<string>("");
    const [singleOrder, setSingleOrder] = useState<OrderResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
        fetchOrders();
    }, [contentLength]);

    const fetchOrders = async () => {
        const response = await GetMyOrdersApi();
        setOrders(response);
        dispatch(
            saveContentLength({ contentLength: response?.length || 0 })
        );
    };
    return (
        <div className="my-orders-container">
            <div className="my-orders-header">
                <h3 className="my-orders-title">My Orders</h3>
            </div>
            <div className="my-orders-body custom-scrollbar">
                {orders && orders.length > 0 ? (
                    orders.map((order) => {
                        return (
                            <div className="my-orders-card">
                                <div className='my-orders-img-details'>
                                    <Image src={'/order.png'} alt="order image" width={50} height={50} className='my-orders-img' />
                                    <div className='my-orders-card-details'>
                                        <p className='my-orders-card-customer'>{order.userID.username}{" "} <span className='my-orders-card-ordered'>has ordered <span className='my-orders-card-customer'>{order.items.length}</span> items</span></p>
                                        <p className='my-orders-card-price'>Total amount: <span className='my-orders-card-customer'>BDT {order.totalAmount}</span></p>
                                        <p className='my-orders-card-date'>Date: {formatTimestamp(order.createdAt)}</p>
                                    </div>
                                </div>
                                <div className='my-orders-card-actions'>
                                    <p className={`my-orders-card-status ${order.status}`}>{order.status}</p>
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
                                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                                        },
                                        content: {
                                            width: "70%",
                                            height: "60%",
                                            margin: "auto",
                                            borderRadius: "10px",
                                            overflow: "auto",
                                        },
                                    }}
                                >
                                    {/* <h3 className='modal-card-title'>Subtotal: ${singleOrder?.totalAmount}</h3> */}
                                    <div className='modal-content'>
                                        {singleOrder && singleOrder.items && singleOrder.items.length > 0 ? (
                                            singleOrder.items.map((item) => (
                                                <div key={item._id} className='modal-card'>
                                                    <Image src={`http://localhost:3000/uploads/${item.itemID.banner}`} alt="product image" width={200} height={200} className='modal-img' />
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
                                    <CgCloseR className="close-button" onClick={closeModal} />
                                </Modal>
                            </div>
                        )
                    })
                ) : (
                    <p>No orders found</p>
                )}
            </div>
        </div>
    )
}

export default MyOrders;

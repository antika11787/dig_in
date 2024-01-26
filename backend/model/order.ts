// import { Schema, model } from "mongoose";
// import { IOrder } from "../types/interfaces";

// const orderSchema = new Schema<IOrder>(
//   {
//     userID: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     cartID: {
//       type: Schema.Types.ObjectId,
//       ref: "Cart",
//       required: true,
//     },
//     address: {
//       type: String,
//       required: [true, "Address should be provided"],
//     },
//     paymentType: {
//       type: String,
//       required: [true, "Payment type should be provided"],
//     },
//   },
//   { timestamps: true }
// );

// const Order = model<IOrder>("Order", orderSchema);
// module.exports = Order;

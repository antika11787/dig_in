import userReducer from "../redux/slices/UserSlice";
import cartReducer from "../redux/slices/CartSlice";
import categoryReducer from "../redux/slices/CategorySlice";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    category: categoryReducer,
});

export default rootReducer;

import userReducer from "../redux/slices/UserSlice";
import cartReducer from "../redux/slices/CartSlice";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
});

export default rootReducer;

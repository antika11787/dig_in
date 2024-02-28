import userReducer from "../redux/slices/UserSlice";
import cartReducer from "../redux/slices/CartSlice";
import contentReducer from "./slices/ContentSlice";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  content: contentReducer,
});

export default rootReducer;

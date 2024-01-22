import userReducer from "../redux/slices/UserSlice";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;

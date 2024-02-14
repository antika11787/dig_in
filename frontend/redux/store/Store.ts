import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../RootReducer";
import { persistStore, persistReducer, PERSIST } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [PERSIST]
        }
    })
});

const persistor = persistStore(store);

export { store, persistor };

import ActivityStore from "./activityStore";
import { createContext, useContext } from "react";

interface Store {
    activityStore: ActivityStore
}

export const store: Store = {
    activityStore: new ActivityStore()
}

export const StoreContext = createContext(store);

//simple react hook

export function useStore() {
    return useContext(StoreContext);
}
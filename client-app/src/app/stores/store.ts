import ActivityStore from "./activityStore";
import { createContext, useContext } from "react";
import CommonStore from "./commonStores";
import UserStore from "./userStore";
import ModalStore from "./modalStores";
import ProfileStore from "./profileStore";
import { Profile } from "../models/profile";

interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore()
}

export const StoreContext = createContext(store);

//simple react hook

export function useStore() {
    return useContext(StoreContext);
}
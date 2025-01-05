import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile, UserActivity } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    userActivities: UserActivity[] = [];
    loadingActivities = false;

    activeActivityTab = 0;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if(activeTab === 3 || activeTab === 4)
                {
                    const predicate = activeTab === 3 ?
                    'followers' : 'following'
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )

        reaction(
            () => this.activeActivityTab,
            activeTab => {
                switch(activeTab) {
                case 0:
                this.loadUserActivities('future');
                console.log("HOEWHREHROE")
                break
                case 1:
                    this.loadUserActivities('past');
                break
                case 2:
                    this.loadUserActivities('hosting')
                break;
                default:
                    this.userActivities = [];
                }
            }
        )
    }

    setActiveTab = (activeTab: number) => {
        this.activeTab = activeTab;
    }

    setActiveActivityTab = (activityTab: number) => {
        this.activeActivityTab = activityTab;
    }

    get isCurrentUser() {
        if (store.userStore && this.profile) {
            return store.userStore.user?.userName === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if(this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url
                    }
                }
                this.uploading = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    deletePhoto = async (photoId: string) => {
        this.loading = true; 
        try {
            await agent.Profiles.deletePhoto(photoId);
            if(this.profile && this.profile.photos) {
                // let photoToDelete = this.profile.photos.find(p => p.id === photoId);
                // this.profile.photos.splice( this.profile.photos.indexOf(photoToDelete!) )
                this.profile.photos = this.profile.photos?.filter(p => p.id !== photoId);
                this.loading = false;
            }

        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error)
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if(this.profile && this.profile.photos){
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id == photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })

        } catch(error) {
            runInAction(() => this.loading = false);
            console.log(error)
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        try {
            await agent.Profiles.update(profile);
            runInAction(() => {
                if (profile.displayName) {
                    let updatedActivity = {...this.profile, ...profile};
                    this.profile = updatedActivity as Profile;
                }
            })
    
        }
        catch (error) {
            console.log(error);
            }
        }

    updateFollowing = async(username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.userName && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if (this.profile && this.profile.username === store.userStore.user?.userName) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile. followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
                this.loading = false;
            })
            
        } catch (error) {
            console.log(error)
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async(predicate: string) => {
        this.loadingFollowings = true;
        try {
           const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
           runInAction(() => {
            this.followings = followings;
            this.loadingFollowings = false;
           })
        } catch(error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false)

        }
    }

    loadUserActivities = async(predicate: string) => {
        this.loadingActivities = true;
        try {
           const activities = await agent.Profiles.listActivities(this.profile!.username, predicate);
           runInAction(() => {
            this.userActivities = activities;
            this.loadingActivities = false;
           })
        } catch(error) {
            console.log(error);
            runInAction(() => this.loadingActivities = false)

        }
    }
}
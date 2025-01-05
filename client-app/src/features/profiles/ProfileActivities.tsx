import { observer } from 'mobx-react-lite';
import {  Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileActivityTab from './ProfileActivityTab';
import { useEffect } from 'react';


export default observer (function ProfileActivities() {

    const {profileStore} = useStore()
    
    const {
        loadUserActivities,
        profile,
        loadingActivities,
 } = profileStore;

    useEffect(() => {
        loadUserActivities('future');
        }, [loadUserActivities, profile]);

    const panes = [
        { menuItem: 'Future Events', render: () => <ProfileActivityTab /> },
        { menuItem: 'Past Events', render: () => <ProfileActivityTab /> },
        { menuItem: 'Hosting', render: () => <ProfileActivityTab /> },
      ]

    
    // function handleUpdateProfile(profile: Partial<Profile>) {
    //     updateProfile(profile).then(() => setEditPhotoMode(false));
    // }

    return (
        <Tab.Pane loading={loadingActivities}>
        <Tab 
        panes={panes}
        menu={{ secondary: true, pointing: true }}
        defaultActiveIndex={0}
        onTabChange={(_, data) => profileStore.setActiveActivityTab(data.activeIndex as number)}
        />
        </Tab.Pane>
    )
}) 
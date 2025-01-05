import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import ProfileEditForm from './ProfileEditForm';

interface Props {
    profile: Profile;
}

export default observer (function ProfileAbout({profile}: Props) {
    const {profileStore: {isCurrentUser, updateProfile}} = useStore();
    const [editProfileMode, setEditPhotoMode] = useState(false);

    
    function handleUpdateProfile(profile: Partial<Profile>) {
        updateProfile(profile).then(() => setEditPhotoMode(false));
    }
        /*

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }
    */
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} >
                    <Header floated='left' icon='user' content={'About ' + profile.displayName} />
                    {isCurrentUser && (
                        <Button floated='right' basic 
                        content={editProfileMode ? 'Cancel' : 'Edit Profile'}
                        onClick={() => setEditPhotoMode(!editProfileMode)}
                         />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editProfileMode ? (
                        <ProfileEditForm profile={profile} updateProfile={handleUpdateProfile} />
                    ) : (
                        <p style={{whiteSpace: 'pre-wrap'}}>{profile.bio}</p>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}) 
import { observer } from 'mobx-react-lite';
import { Card, Grid } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import UserActivityCard from './UserActivityCard';

export default observer(function ProfileActivityTab() {
    const {profileStore} = useStore();
    const {userActivities} = profileStore;


    return (

            <Grid>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {userActivities.map(activity => (
                             <UserActivityCard key={activity!.id} userActivity={activity!}/>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>

    )
})
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Image, List, Popup } from 'semantic-ui-react';
import { IProfile } from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
    attendees: IProfile[];
}

export default observer( function ActivityListItemAttendee({attendees}: Props) {
    const styles = {
        borderColor: 'orange',
        borderWidth: 3,
        boxShadow: 'rgba(227, 183, 21, 0.2) 0px 7px 29px 0px'
    }
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                        <Image 

                        size='mini' 
                        circular src={attendee.image || '/assets/user.png'} 
                        bordered
                        style={attendee.following? styles : null}
                        />
                    </List.Item>
                    }
                    >
            <Popup.Content>
                    <ProfileCard profile={attendee} />
                </Popup.Content>
                    </Popup>
                
                
               
            ))}
        </List>
    )
})

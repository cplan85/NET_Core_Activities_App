import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

interface Props {
    profile: Profile;
}

function truncateText(inputText: string) {
    if (inputText.length >80) {
        return inputText.substring(0, 80) + "...";
    }
    else 
    return inputText
}

export default observer(function ProfileCard({profile}: Props) {
    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{profile.bio? truncateText(profile.bio!) : ''}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                {profile.followersCount} {profile.followersCount == 1 ? "Follower" : "Followers"}
            </Card.Content>
            <FollowButton profile={profile} />
        </Card>
    )
})
import { UserActivity } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Props {
    userActivity: UserActivity;
}

export default observer(function UserActivityCard({userActivity: activity}: Props) {

    const formattedDate = activity.date ? format(new Date(activity.date), "do MMM yyyy h:mm a") : '';
    return (
        <Card as={Link} to={`/activities/${activity.id}`}>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Description>{formattedDate}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='glass martini' />{activity.category}
            </Card.Content>
        </Card>
    )
})
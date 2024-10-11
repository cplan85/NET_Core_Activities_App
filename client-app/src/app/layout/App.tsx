import { Fragment, useEffect, useState } from 'react'
import './styles.css'
import axios from 'axios';
import { Container } from 'semantic-ui-react'
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activitites/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false)


  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      //strict mode will make this have 2 requests
      //console.log(response)
      setActivities(response.data)
    })
  }, [])

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id))
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined)
  }

  function handleFormOpen(id?: string) {
    //set activity to be undefined if it is or not
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleDeleteActivity(id: string) {
    setActivities(activities.filter(x => x.id !== id))

  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    // we are looping through activities and if the id doesn't match the id, then we have those activties plus the new activity added
    activity.id ? 
    setActivities([...activities.filter(x=> x.id !== activity.id), activity])
    : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  return (
    <Fragment>
       <NavBar openForm={handleFormOpen}/>
       <Container style={{marginTop: '7rem'}}>

        <ActivityDashboard activities={activities} 
        selectedActivity ={selectedActivity}
        selectActivity={handleSelectActivity}
        cancelSelectActivity={handleCancelSelectActivity}
        editMode={editMode}
        openForm={handleFormOpen}
        closeForm={handleFormClose}
        createOrEdit={handleCreateOrEditActivity}
        deleteActivity={handleDeleteActivity}
        />
       </Container>

    </Fragment>
  )
}

export default App

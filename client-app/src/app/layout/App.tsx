import { Fragment, useEffect, useState } from 'react'
import './styles.css'
import axios from 'axios';
import { Container } from 'semantic-ui-react'
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activitites/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    /*
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      //strict mode will make this have 2 requests
      //console.log(response)
      setActivities(response.data)
    })
      */
     agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        // deal with date formating to show in the form
        activity.date = activity.date.split('T')[0];
        activities.push(activity);

      })
      setActivities(activities);
      setLoading(false);
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
    setSubmitting(true);
    agent.Activities.delete(id).then( () => {
      setActivities(activities.filter(x => x.id !== id))
      setSubmitting(false);
    })

  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);
    // we are looping through activities and if the id doesn't match the id, then we have those activties plus the new activity added
  

    if (activity.id ) {
      agent.Activities.update(activity).then( () => {
        setActivities([...activities.filter(x=> x.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
        

      })
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

  if (loading) return <LoadingComponent content ='Loading app' />

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
        submitting={submitting}
        />
       </Container>

    </Fragment>
  )
}

export default App

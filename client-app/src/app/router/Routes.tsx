import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activitites/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activitites/form/ActivityForm";
import ActivityDetails from "../../features/activitites/details/ActivityDetails";

export const routes: RouteObject[] = [
    {
        path: '/', 
        element: <App />,
        children: [
            {path: '', element: <HomePage/>},
            {path: 'activities', element: <ActivityDashboard/>},
            {path: 'activities/:id', element: <ActivityDetails/>},
            {path: 'createActivity', element: <ActivityForm key='create'/>},
            {path: 'manage/:id', element: <ActivityForm key='manage'/>}
        ]
    }
]

export const router = createBrowserRouter(routes);
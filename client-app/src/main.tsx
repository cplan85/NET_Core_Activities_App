import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'
import 'react-calendar/dist/Calendar.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-toastify/dist/ReactToastify.min.css'
import './app/layout/styles.css'
import { store, StoreContext} from './app/stores/store'
import { router } from './app/router/Routes'
import { RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>

    </StoreContext.Provider>
    <RouterProvider router={router} />

  </StrictMode>,
)

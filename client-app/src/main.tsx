import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'
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

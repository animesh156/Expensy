import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import AppWrapper from './App.jsx'
import { ThemeProvider } from "@material-tailwind/react";
import {store} from './app/store.js'
import {Provider} from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}>

    <ThemeProvider>
      
      <AppWrapper />
      </ThemeProvider>

    </Provider>
   
   
  </StrictMode>,
)

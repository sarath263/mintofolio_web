import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import {
  RouterProvider,
  createBrowserRouter
} from "react-router";
import { allRoutes } from './Router';

let router = createBrowserRouter(Object.keys(allRoutes).map((path)=>
  ({
    path,
    Component: allRoutes[path],
  })
));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

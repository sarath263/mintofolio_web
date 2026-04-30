import { createBrowserRouter } from 'react-router-dom';
import App from './App'
import DiscoverPage from './modules/discover/discover'
import ProfilePage from './modules/profile/profile'
import UploadPage from './modules/upload/upload'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/upload",
    element: <UploadPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/discover",
    element: <DiscoverPage />,
  }
]);

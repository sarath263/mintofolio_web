import App from './App'
import DiscoverPage from './modules/discover/discover'
import ProfilePage from './modules/profile/profile'
import UploadPage from './modules/upload/upload'

export const allRoutes={
    "/":App,
     "/upload":UploadPage,
     "/profile":ProfilePage,
     "/discover":DiscoverPage
}


import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import LoginPage from './modules/login/login'

function App() {

  return (
    <GoogleOAuthProvider clientId="617034857949-lfa00pnn2q7f53dlu5qa7qi2o6i1bf5l.apps.googleusercontent.com">
      <LoginPage />
    </GoogleOAuthProvider>
  )
}

export default App

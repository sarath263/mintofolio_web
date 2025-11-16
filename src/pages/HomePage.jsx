import store from "../lib/store";
import LoginPage from "../modules/login/login"
import { Root } from 'native-state-react';

export default function Home() {
  return (
    <>
      <Root initial={store}/>
      <LoginPage />
    </>
  );
}

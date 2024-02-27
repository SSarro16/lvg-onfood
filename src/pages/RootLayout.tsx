import { Outlet } from 'react-router-dom';
import MainNavigator from '../components/MainNavigator';

function RootLayout() {
  return (
    <>
      <MainNavigator />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
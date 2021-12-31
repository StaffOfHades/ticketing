import DefaultErrorPage from 'next/error';

import { CurrentUserContext, useCurrentUser } from '../../hooks/use-current-user';
import { Navbar } from '../navbar';
import { LoadingScreen } from './LoadingScreen';

export const Layout = ({ children }) => {
  const { currentUser, error, isLoading, signout } = useCurrentUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <DefaultErrorPage />;
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, signout }}>
      <Navbar />
      <main className="container mx-auto px-4 mt-4">{children}</main>
    </CurrentUserContext.Provider>
  );
};

import { useContext } from 'react'

import { CurrentUserContext } from '../hooks/use-current-user'
import styles from './index.module.scss';

export function LandingPage() {
  const { currentUser } = useContext(CurrentUserContext);

  return <h1>{`You are ${currentUser ? '' :  'not '}signed in`}</h1>;
}

export default LandingPage;

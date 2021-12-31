import { createContext, useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const CurrentUserContext = createContext({
  currentUser: null,
  signout: () => undefined,
});

// 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/authentication-service/users/current-user'

export const useCurrentUser = () => {
  const { data, error, mutate } = useSWR('/authentication-service/users/current-user', fetcher);

  const signout = useCallback(async () => {
    try {
      await axios.post('/authentication-service/users/signout');
      mutate({ currentUser: null }, false);
    } catch (error) {
      console.error(error);
    }
  }, [mutate]);

  return {
    currentUser: data?.currentUser ?? null,
    error,
    isLoading: !error && !data,
    signout,
  };
};

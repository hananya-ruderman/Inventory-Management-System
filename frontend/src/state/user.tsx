import {useContext} from 'react';
import { UserContext } from './context';

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserProvider is missing");
  }

  return context;
}
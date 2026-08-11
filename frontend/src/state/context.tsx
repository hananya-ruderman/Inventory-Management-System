import {createContext, useState} from 'react';
import type { ProviderProps, UserState } from './types';

export const UserContext = createContext<UserState | null>(null);

export default function UserProvider({ children }: ProviderProps) {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
}
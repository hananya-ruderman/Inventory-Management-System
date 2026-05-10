export type ProviderProps = {       
  children: React.ReactNode;
};

export type UserState = {
  currentUser: string  | null;
  setCurrentUser: React.Dispatch<React.SetStateAction< string  | null>>;
};
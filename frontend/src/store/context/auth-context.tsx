import { User } from "firebase/auth";
import { NavigateFunction } from "react-router-dom";
import { SignOutUser, userStateListener } from "../../vendors/firebase";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

type GetTokenAction = () => Promise<string | undefined>;

type SignOutFunction = (navigate: NavigateFunction) => void;

interface AuthContext {
  currentUser: User | null;
  setCurrentUser: (_user: User) => void;
  signOut: SignOutFunction;
  getToken: GetTokenAction;
}

const AuthContext = createContext<AuthContext>({
  // "User" comes from firebase auth-public.d.ts
  currentUser: {} as User | null,
  setCurrentUser: () => {
    return;
  },
  signOut: () => {
    return;
  },
  getToken: async () => {
    return "";
  },
});

const AuthProvider: React.FC<Props> = (props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return unsubscribe;
  }, [setCurrentUser]);

  // As soon as setting the current user to null,
  // the user will be redirected to the home page.
  const signOut = (navigate: NavigateFunction) => {
    SignOutUser();
    setCurrentUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  const getToken = async () => {
    if (currentUser) {
      const token = await currentUser.getIdToken();
      return token;
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    signOut,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
export type { GetTokenAction, SignOutFunction };

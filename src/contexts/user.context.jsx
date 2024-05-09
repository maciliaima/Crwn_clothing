// createContext: créer un nouveau contexte
//useState & useEffect:gérer l'état local et exécuter des effets de bord.
import { createContext, useState, useEffect } from 'react';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from '../utils/firebase/firebase.utils';
//createContext: crée un contexte utilisateur.
export const UserContext = createContext({
//setCurrentUser : une fonction qui ne fait rien
  setCurrentUser: () => null,
//currentUser : initialisé à null.
  currentUser: null,
});
//composant utilisé pour fournir le contexte utilisateur à tous les composants enfants.
export const UserProvider = ({ children }) => {
//currentUser, initialisée à null ainsi setCurrentUser pour mettre à jour cette variable d'état
  const [currentUser, setCurrentUser] = useState(null);
//stocker currentUser et setCurrentUser.
  const value = { currentUser, setCurrentUser };
//useEffect:lors du montage du composant écoute les changements d'état d'authentification de l'utilisateur 
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
//si l'utilisateur est connecté, elle créer un document utilisateur dans Firebase.
      if (user) {
        createUserDocumentFromAuth(user);
      }
//met à jour l'état local avec l'utilisateur actuel.
      setCurrentUser(user);
    });
//unsubscribe: nettoyer l'effet lors du démontage du composant.
    return unsubscribe;
  }, []);
//enveloppe tous les composants enfants avec le contexte utilisateur fourni par value.
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

import { createContext, useState, useEffect } from 'react';

import { getCategoriesAndDocuments } from '../utils/firebase/firebase.utils';
//crée un contexte Le contexte est initialisé avec un objet, initialisée l'objet vide.
export const CategoriesContext = createContext({
  categoriesMap: {},
});
//Ce composant sera utilisé pour fournir le contexte des catégories à tous les composants enfants dans l'arbre de composants.
export const CategoriesProvider = ({ children }) => {
//useState: déclarer une variable d'état initialisée à vide et setCategoriesMap pour mettre à jour cette variable d'état.
  const [categoriesMap, setCategoriesMap] = useState({});
//useEffect: exécuter une fonction de rappel lors du montage du composant. 
  useEffect(() => {
    const getCategoriesMap = async () => {
//appelle la fonction getCategoriesAndDocuments pour récupérer les données de la bdd Firestore.
      const categoryMap = await getCategoriesAndDocuments();
//setCategoriesMap: met à jour l'état local categoriesMap avec les données récupérées. 
      setCategoriesMap(categoryMap);
    };

    getCategoriesMap();
//[]: cet effet ne dépend d'aucune valeur et ne doit être exécuté qu'une seule fois lors du montage du composant
  }, []);
//qui enveloppe tous les composants enfants avec le contexte des catégories fourni par value.
  const value = { categoriesMap };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

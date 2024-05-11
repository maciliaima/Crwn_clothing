// Import des dépendances nécessaires depuis React
import { useContext, Fragment } from 'react';
// Import du contexte des catégories
import { CategoriesContext } from '../../contexts/categories.context';
// Import du composant CategoryPreview
import CategoryPreview from '../../components/category-preview/category-preview.component';
// Définition du composant CategoriesPreview
const CategoriesPreview = () => {
// Récupération du contexte des catégories avec le hook useContext
  const { categoriesMap } = useContext(CategoriesContext);
// Rendu du composant
  return (
// Utilisation de Fragment pour englober plusieurs éléments sans créer de div supplémentaire
    <Fragment>
{/* Utilisation de la méthode map pour parcourir chaque catégorie */}
      {Object.keys(categoriesMap).map((title) => {
// Récupération des produits de la catégorie en cours
        const products = categoriesMap[title];
// Rendu du composant CategoryPreview avec les propriétés title et products
        return (
          <CategoryPreview key={title} title={title} products={products} />
        );
      })}
    </Fragment>
  );
};

export default CategoriesPreview;

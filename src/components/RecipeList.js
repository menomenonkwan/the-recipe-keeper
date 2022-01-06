import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useThemeContext";
// styles
import styles from './RecipeList.module.css';
import Masonry from 'react-masonry-css'

export default function RecipeList({ recipies }) {
  const { mode } = useTheme();

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  // sort recipies alphabetically
  const sortedRecipies = recipies.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    if (titleA < titleB) { return -1; }
    if (titleA > titleB) { return 1; }
    return 0;
  });

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={styles["my-masonry-grid"]}
      columnClassName={styles["my-masonry-grid_column"]}
    >
      {sortedRecipies.map(recipe => (
        <div key={recipe.id} className={`${styles["recipe-card"]} ${styles[mode]}`}>
          <img 
            src={
              recipe.image ? recipe.image :
              recipe.imageURL ? recipe.imageURL :
              "https://www.eatthis.com/wp-content/uploads/sites/4/2020/09/mixed-vegetables.jpg"
            }
            alt={ recipe.title } 
          />
            <h2>{ recipe.title }</h2>
          <p>{ recipe.cookingTime }</p>
          <h4>{ recipe.ingredients.length } ingredients</h4>
          <Link to={`/recipies/${recipe.id}`} className={`btn ${styles["btn-link"]}`}>Cook This</Link>
        </div>
      ))}
    </Masonry>
  )
}

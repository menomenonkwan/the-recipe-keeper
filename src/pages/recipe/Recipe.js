import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from "../../hooks/useThemeContext";
import { projectFirestore } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
// components
import Loader from "react-loader-spinner";
import garbage from '../../assets/garbage.svg';
// styles
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import styles from './Recipe.module.css';

const TextLine = ({ item }) => {
  const [checked, setChecked] = useState(false);

  if (item.length === 0) {
    return null;
  }

  return (
    <li 
    className={checked ? `${styles.check}` : ''}
    onClick={() => setChecked(!checked)}
    >{ item }
    </li>
    )
  }

export default function Recipe() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { color, mode } = useTheme();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const unsub = projectFirestore
      .collection('recipies')
      .doc(id)
      .onSnapshot(doc => {
        if (doc.exists) {
          setIsLoading(false);
          setRecipe(doc.data());
        } else {
          setIsLoading(false);
          setError('Could not find that recipe');
        }
      })

      return () => unsub();
  }, [id]);

  const handleDelete = (id) => {
    projectFirestore
      .collection('recipies')
      .doc(id)
      .delete();

    navigate('/');
  }
  
  return (
    <div className="wrapper">
      {error && <p>{ error }</p>}
      {isLoading &&       
        <Loader
        type="Oval"
        color="var(--blue, turquoise)"
        height={300}
        width={300}
        />}
      {recipe && 
        <div className={`${styles.recipe} ${styles[mode]}`}>
          <div className={styles.frame}>
            <img 
              src={ 
                recipe.image ? recipe.image :
                recipe.imageURL ? recipe.imageURL :
                "https://www.eatthis.com/wp-content/uploads/sites/4/2020/09/mixed-vegetables.jpg"
              } 
              alt={ recipe.title } 
            />
          </div>
          {user && <img 
            className={styles.garbage}
            src={garbage} 
            alt="delete icon" 
            onClick={() => handleDelete(id)}
          />}
          {user && 
            <Link to={`/update/${id}`} className={`${styles.update} btn`}>update</Link>
          }
          <h2 style={{ color: color }}>{ recipe.title }</h2>
          <em>{ recipe.cookingTime }</em>
          <h4>Ingredients:</h4>
          <ul className={styles["ingredient-list"]}>
            {recipe.ingredients.map(item => (
              <TextLine key={item} item={item}/>
              ))}
          </ul>
          {recipe.preparation &&
            <>
              <h4>Preparation:</h4>
              <ul className={styles["text-list"]}>
                {recipe.preparation.split('.').map((line,i) => <TextLine key={i} item={line}/>)}
              </ul>
            </>
          }
          {recipe.sauce &&
            <>
              <h4>Sauce:</h4>
              <ul className={styles["text-list"]}>
                {recipe.sauce.split('.').map((line,i) => <TextLine key={i} item={line}/>)}
              </ul>
            </>
          }
          {recipe.directions &&
            <>
              <h4>Directions:</h4>
              <ul className={styles["text-list"]}>
                {recipe.directions.split('.').map((line,i) => <TextLine key={i} item={line}/>)}
              </ul>
            </>
          }
          <h4>Notes:</h4>
          <ul className={styles["text-list"]}>
            {recipe.notes.split('.').map((line,i) => <TextLine key={i} item={line}/>)}
          </ul>
          {recipe.recipeURL &&
            <button className={`btn ${styles.link}`}><a href={recipe.recipeURL}>view website</a></button>
          }
        </div>
      }      
    </div>
  )
}

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectFirestore, projectStorage } from "../../firebase/config";
import { generateKeywords } from "../../utils/helpers";
// components
import Loader from "react-loader-spinner";
// styles
import styles from '../create/Create.module.css';

export default function Update() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [preparation, setPreparation] = useState('');
  const [sauce, setSauce] = useState('');
  const [directions, setDirections] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [recipeURL, setRecipeURL] = useState('');
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [keyWords, setKeyWords] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if(!recipe) { return };

    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setPreparation(recipe.preparation);
    setSauce(recipe.sauce);
    setDirections(recipe.directions);
    setCookingTime(recipe.cookingTime.split(' ')[0]);
    setNotes(recipe.notes);
    setRecipeURL(recipe.recipeURL);
    setImageURL(recipe.imageURL);

  }, [recipe])

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

  const handleAddIngredient = (e) => {
    e.preventDefault();

    if (!ingredients.includes(ingredient.trim())) {
      setIngredients(prev => [ ...prev, ingredient ]);
      setKeyWords(generateKeywords(title, [...ingredients, ingredient]));
    }

    inputRef.current.focus();
    setIngredient('');
  }

  const handleRemoveIngredient = (e) => {
    e.preventDefault();
    setIngredients(prev => prev.filter(ing => ing !== e.target.textContent))
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    // upload user thumbnail
    const uploadPath = `images/${image.name}`;
    const img = await projectStorage.ref(uploadPath).put(image);
    const imgUrl = await img.ref.getDownloadURL();

    const updatedDoc = { title, ingredients, preparation, sauce, directions, cookingTime: cookingTime + ' minutes', notes, image: imgUrl, recipeURL, imageURL, keyWords };
    
    try {
      await projectFirestore
        .collection('recipies')
        .doc(id)
        .update(updatedDoc);
      navigate('/');
    } catch (err) {
      console.log(err);
      setError('Could not update recipe... sorry')
    }
  }

  const handleFileChange = (e) => {
    setImage(null);
    let selected = e.target.files[0];

    if (!selected.type.includes('image')) {
      setImageError('Selected file must be an image');
      return;
    }
    if (selected.size > 1000000) {
      setImageError('Image file size must be less than 1Mb');
      return;
    }

    setImageError(null);
    setImage(selected);
    console.log(image);
    console.log(selected);
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
        <form onSubmit={handleUpdate} className={styles['create-form']}>
          <h2>Update Recipe</h2>

          <fieldset>
            <label>
              <p>Recipe Title:</p>
              <input 
                type="text" 
                onChange={(e) => {setTitle(e.target.value); setKeyWords(generateKeywords(e.target.value, ingredients))}}
                value={title}
                required
              />
            </label>
          </fieldset>

          <fieldset>
            <label>
              <p>Ingredients:</p>
              <div className={styles.ingredient}>
                <input 
                  type="text"
                  onChange={(e) => setIngredient(e.target.value)}
                  value={ingredient}
                  ref={inputRef}
                />
                <button type="submit" onClick={handleAddIngredient}>add</button>
              </div>
            </label>
          </fieldset>
          {ingredients.length > 0 &&
            <ul className={styles["ingredients-list"]}>
              {ingredients.map(item => <li key={item} className={styles['ing-list']} onClick={handleRemoveIngredient}>{item}</li>)}
            </ul>
          }

          <fieldset>
            <label>
              <p>Preparation:</p>
              <textarea 
                onChange={(e) => setPreparation(e.target.value)}
                value={preparation}
                rows="6" 
              />
            </label>
          </fieldset>

          <fieldset>
            <label>
              <p>Sauce:</p>
              <textarea 
                onChange={(e) => setSauce(e.target.value)}
                value={sauce}
                rows="6" 
              />
            </label>
          </fieldset>

          <fieldset>
            <label>
              <p>Directions:</p>
              <textarea 
                onChange={(e) => setDirections(e.target.value)}
                value={directions}
                rows="6" 
              />
            </label>
          </fieldset>

          <fieldset>
            <label>
              <p>Time To Cook <em>(minutes)</em>:</p>
              <input 
                type="number"
                onChange={(e) => setCookingTime(e.target.value)}
                value={cookingTime}
                required
                min="0"
              />
            </label>
          </fieldset>
          
          <fieldset>
            <label>
              <p>Notes:</p>
              <textarea 
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
                rows="4" 
              />
            </label>
          </fieldset>

          <fieldset>
            <label>
              <p>Recipe URL:</p>
              <input 
                type="text"
                onChange={(e) => setRecipeURL(e.target.value)}
                value={recipeURL}
                rows="4" 
              />
            </label>
          </fieldset>

          <fieldset className={styles['image-select']}>
            <label>
              <p>Image:</p>
              <input 
                type="file" 
                onChange={handleFileChange}
              />
              {imageError && <div className='error'>{imageError}</div>}
            </label>
            <p> - or - </p>
            <label>
              <p>Image URL:</p>
              <input 
                type="text"
                onChange={(e) => setImageURL(e.target.value)}
                value={imageURL}
              />
            </label>
          </fieldset>

          <button type="submit" className="btn" style={{ margin: '30px auto' }} >Submit</button>
        </form>
      }
    </div>
  )
}

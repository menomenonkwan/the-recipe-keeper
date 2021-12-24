import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import { generateKeywords } from "../../utils/helpers";
// styles
import styles from './Create.module.css';

export default function Create() {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [preparation, setPreparation] = useState('');
  const [sauce, setSauce] = useState('');
  const [directions, setDirections] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [notes, setNotes] = useState('');
  // const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [keyWords, setKeyWords] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doc = { title, ingredients, preparation, sauce, directions, cookingTime: cookingTime + ' minutes', notes, imageURL, keyWords };
    // const doc = { title, ingredients, preparation, sauce, directions, cookingTime: cookingTime + ' minutes', notes, image, imageURL, keyWords };

    try {
      await projectFirestore
        .collection('recipies')
        .add(doc);

      navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

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

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className={styles['create-form']}>
        <h2>Add A Recipe</h2>

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
          {/* <label>
            <p>Image:</p>
            <input 
              type="file" 
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p> - or - </p> */}
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
    </div>
  )
}

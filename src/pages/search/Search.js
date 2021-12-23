import { useEffect, useState } from "react";
import { useLocation } from "react-router"
import Loader from "react-loader-spinner";
import RecipeList from "../../components/RecipeList";

// styles
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { projectFirestore } from "../../firebase/config";

export default function Search() {
  const search = useLocation().search;
  const name = new URLSearchParams(search).get('q');
  const [recipies, setRecipies] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setRecipies(null);
    setIsPending(true);

    const unsub = projectFirestore
      .collection('recipies')
      .where('keyWords', 'array-contains', name.toLowerCase())
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          setError('No recipies to load');
          setIsPending(false);
        } else {
          let results = [];
          snapshot.docs.forEach(doc => {
            results.push({ id: doc.id, ...doc.data() })
          })
          setRecipies(results);
          setIsPending(false);
          setError(false);
        }
      }, (err) => {
        setError(err.message);
        setIsPending(false);
      });

      return () => unsub();
  }, [name]);

  return (
    <div className="wrapper">
      {error && <p>{ error }</p>}
      {isPending &&       
        <Loader
          type="Oval"
          color="var(--blue, turquoise)"
          height={300}
          width={300}
        />}
      {recipies && <RecipeList recipies={recipies} />}
    </div>
  )
}

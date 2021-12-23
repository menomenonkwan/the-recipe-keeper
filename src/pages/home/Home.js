import { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
// components
import RecipeList from "../../components/RecipeList";
import Loader from "react-loader-spinner";
// styles
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function Home() {
  const [recipies, setRecipies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const unsub = projectFirestore
      .collection('recipies')
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          setError('No recipies to load');
          setIsLoading(false);
        } else {
          let results = [];
          snapshot.docs.forEach(doc => {
            results.push({ id: doc.id, ...doc.data() })
          })
          setRecipies(results);
          setIsLoading(false);
        }
      }, (err) => {
        setError(err.message);
        setIsLoading(false);
      })

      return () => unsub();
  }, []);

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
      {recipies && <RecipeList recipies={recipies} />}
    </div>
  )
}

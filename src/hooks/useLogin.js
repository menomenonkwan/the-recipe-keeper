import { useEffect, useState } from "react"
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";


export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(false);
    setIsLoading(true);

    try {
      // login user 
      const res = await projectAuth.signInWithEmailAndPassword(email, password);

      if (!res) {
        throw new Error('Could not complete login');
      }

      // dispatch login action 
      dispatch({ type: 'LOGIN', payload: res.user });

      // update state
      if(!isCancelled) {
        setIsLoading(false);
        setError(null);
      }

    } catch (err) {
      if(!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true);
  }, [])

  return { error, isLoading, login }
} 
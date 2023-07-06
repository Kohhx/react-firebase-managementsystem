import { useState, useEffect } from 'react';
import { projectAuth } from '../firebase/config';
import { projectFirestore } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const ctx = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    // Sign user out
    try {
      console.log("trying to login")
      const res =  await projectAuth.signInWithEmailAndPassword(email, password);

      // Set user to online true just before login
      const { uid } = res.user;
      await projectFirestore.collection('users').doc(uid).update({
        online: true,
      })

      ctx.dispatch({ type: 'LOGIN', payload: res.user });
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }

    } catch (error) {
      console.log("tried and error out")
      // setError(error.message);
      if (!isCancelled) {
        setError(error.message);
        setIsPending(false);
        console.log(error.message)
      }
    }
  }


  useEffect(() => {
    return () =>  {
      console.log(isCancelled)
      setIsCancelled(true);}
  }, [])

  return {error, isPending, login}
}

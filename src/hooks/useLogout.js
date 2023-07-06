import { useState, useEffect } from 'react';
import { projectAuth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { projectFirestore } from '../firebase/config';


export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const ctx = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    // Sign user out
    try {

      // Set user to online false just before logout
      const { uid }= ctx.user;
      await projectFirestore.collection('users').doc(uid).update({
        online: false,
      })

      await projectAuth.signOut();
      ctx.dispatch({ type: 'LOGOUT' });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }

    } catch (error) {
      if (!isCancelled) {
        setError(error.message);
        setIsPending(false);
        console.log(error.message)
      }
    }
  }


  useEffect(() => {
    return () => setIsCancelled(true);
  }, [])

  return { error, isPending, logout }
}

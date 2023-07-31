import { useState, useEffect } from 'react';
import { projectAuth } from '../firebase/config';
import { projectStorage } from '../firebase/config';
import { projectFirestore } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const ctx = useAuthContext();

  const signup = async (email, password, displayName, profileImage) => {
    setError(null);
    setIsPending(true);

    try {
      // Signup the user
      const res = await projectAuth.createUserWithEmailAndPassword(email, password);
      console.log(res.user);
      if (!res) {
        throw new Error("Could not complete the signup")
      }

      // Upload user profile image
      const uploadPath = `profileImages/${res.user.uid}/${profileImage.name}`;
      const img = await projectStorage.ref(uploadPath).put(profileImage);
      const imgUrl = await img.ref.getDownloadURL();
      console.log(imgUrl)

      // Update the user display name
      await res.user.updateProfile({ displayName, photoURL: imgUrl });

      // Create user document
      await projectFirestore.collection('users').doc(res.user.uid).set({
        online: true,
        displayName,
        photoURL: imgUrl,
        email,
      })

      // Update the user context
      ctx.dispatch({ type: 'SIGNUP', payload: res.user })

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }

    } catch (error) {
      if (!isCancelled) {
        console.log(error.message)
        setError(error.message);
        setIsPending(false);
      }
    }

  }

  useEffect(() => {
    return () => setIsCancelled(true);
  }, [])

  return { error, isPending, signup }
}

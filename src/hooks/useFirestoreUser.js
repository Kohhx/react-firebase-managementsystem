import { useReducer, useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";
import { v4 as uuidv4 } from "uuid";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, error: null, success: false };
    case "ADDED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        ...state,
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        ...state,
        isPending: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

export const useFirestoreUser = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // Get User collection
  const userRef = projectFirestore.collection("users");

  // Only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // Get All Users
  const getAllUsers = async () => {
    dispatch({ type: "IS_PENDING" });
    try {
      const allUsers = await userRef.get();
      const users = allUsers.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: users,
      });
      return users;
    } catch (error) {
      dispatchIfNotCancelled({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  // Find users by first name, last name or email
  const getUserBySearch = async (searchTerm) => {
    dispatch({ type: "IS_PENDING" });
    try {
      // Find users by first name, last name or email
      const foundUsersFb = await userRef
        .where("displayName", "==", searchTerm)
        .orWhere("email", "==", searchTerm)
        .get();

      const foundUsers = foundUsersFb.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });

      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: foundUsers,
      });
      return foundUsers;
    } catch (error) {
      console.log(error);
      dispatchIfNotCancelled({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  // Do not change state if component is unmounted
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { ...response, getAllUsers, getUserBySearch };
};

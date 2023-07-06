import { createContext, useReducer, useEffect } from 'react'
import { projectAuth } from '../firebase/config';

export const AuthContext = createContext();


export const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_READY':
      return {...state, authReady: true, user: action.payload}
    case 'SIGNUP':
      return {...state, user: action.payload}

    case 'LOGIN':
      return {...state, user: action.payload}

    case 'LOGOUT':
      return {...state, user: null}
    default:
      return state;
  }

}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authReady:false
  });

  useEffect(() => {
    const unsub  = projectAuth.onAuthStateChanged((user) => {
      dispatch({type: 'AUTH_READY', payload: user})
      unsub();
    })
  },[])

  console.log("AuthContext State: ", state)

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

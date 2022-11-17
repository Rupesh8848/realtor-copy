import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React from 'react'

export function useAuthStatus() {
    const [loggedIn, setLoggedIn] = React.useState(false)
    const [checking, setChecking] = React.useState(true)

    React.useEffect(()=>{
        const auth = getAuth()
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setLoggedIn(true)
            }
            setChecking(false)
        })
    },[])
  return {loggedIn, checking}
}

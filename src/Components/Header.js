import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
export default function Header() {
    const [pageState, setPageState] = React.useState("Sign In")

    const location = useLocation();
    const navigate = useNavigate();

    const auth = getAuth()
    React.useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setPageState("Profile")
            }
            else{
                setPageState("Sign In")
            }
        })
    }, [auth])

    function checkRoute(route){
        return route === location.pathname
    }

    
  return (
    <section className='bg-white border-b shadow-sm sticky top-0 z-40'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div>
                <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg' 
                alt='Logo Image'
                className='h-5 cursor-pointer ' 
                onClick={()=>navigate("/")} />
            </div>
            <div>
                <ul className='flex space-x-10'>
                    <li className= {`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
                    ${checkRoute("/") && "text-black border-b-red-500"} cursor-pointer`} 
                    onClick={()=>navigate("/")}>Home</li>
                    <li className= {`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
                    ${checkRoute("/offers") && "text-black border-b-red-500"} cursor-pointer`} 
                    onClick={()=>navigate("/offers")}>Offers</li>
                    
                    
                    <li className= {`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent 
                    ${(checkRoute("/sign-in") || checkRoute("/profile")) && "text-black border-b-red-500"} cursor-pointer`} 
                    onClick={()=>navigate("/profile")}>{pageState}</li>

                </ul>
            </div>
        </header>

    </section>
  )
}

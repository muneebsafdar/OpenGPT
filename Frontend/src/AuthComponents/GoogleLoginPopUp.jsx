import React from 'react'
import { FcGoogle } from "react-icons/fc";

const GoogleLoginPopUp = ({handleGoogleLogin}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"> 
                <div className="w-100 rounded-2xl border border-gray-800 bg-black p-8 text-white shadow-2xl"> {/* Heading */} 
                    <div className="mb-8 text-center"> 
                        <h2 className="text-3xl font-semibold"> Welcome to OpenGPT </h2> 
                        <p className="mt-3 text-sm leading-6 text-gray-400"> Sign in with your Google account to continue using OpenGPT and access all of its features. </p> 
                    </div> {/* Google Login Button */}
                     <button onClick={handleGoogleLogin} className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 font-medium text-black transition hover:bg-gray-200 active:scale-[0.98]" > 
                        <FcGoogle size={22} /> <span>Continue with Google</span> 
                    </button> 
                </div> 
            </div>
    )
}

export default GoogleLoginPopUp
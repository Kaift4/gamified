"use client";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../utils/firebaseConfig";

export default function Login() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Prevents flickering
  const [isOpen, setIsOpen] = useState(false); // Start closed

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Checking if user is logged in when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // Firebase auth check is complete
      if (!currentUser) {
        setIsOpen(true); // Open login modal if not signed in
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("User signed in!");
      setIsOpen(false); // Close modal after login
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleClose = () => setIsOpen(false);

  // Prevent flicker  Show nothing while checking auth state
  if (isLoading) return null;

  // Only show popup if user is NOT signed in
  if (!isOpen || user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999]">
      <div className="relative bg-[#202124] p-12 rounded-3xl shadow-2xl w-[95%] max-w-[600px] text-center text-white scale-110 sm:scale-125">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-semibold mb-8">
          LET'S GET YOU STARTED! 🎯
        </h2>

        <button
          onClick={handleLogin}
          className="bg-white text-gray-700 flex items-center justify-center gap-4 w-full py-4 rounded-xl shadow-lg hover:bg-gray-200 transition text-xl"
        >
          <FcGoogle className="text-3xl" />
          <span className="font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}

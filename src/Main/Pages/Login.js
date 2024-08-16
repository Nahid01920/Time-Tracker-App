// Login.js
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db, provider } from "../firebase-config";

function Login({ setIsAuth, setUserData }) {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dbref = collection(db, "userData");
  const [loading, setLoading] = useState(false);
  const signInWithEmail = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all details!");
      return;
    }
    try {
      const loginuser = await signInWithEmailAndPassword(auth, email, password);
      if (loginuser) {
        const getuser = await getDocs(dbref);
        const user_snap = getuser.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const user = user_snap.find((data) => {
          return data.Email === email;
        });
        setUserData(user);
        setIsAuth(true);
        navigate("/");
        localStorage.setItem("isAuth", true);
        console.log("Login successful!");
        toast.success("Login successful!");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toast.error("Create an account!");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Wrong password");
      } else if (error.code === "auth/user-not-found") {
        toast.error("User not found");
      } else {
        toast.error(error.code);
      }
      console.error("Error signing in with email and password:", error);
    }
  };

  const signInWithGoogle = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate("/");
        toast.success("Login successful!");
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
        toast.error("Error signing in with Google");
      });
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <ClipLoader
              color="#36d7b7"
              loading={loading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div>
            <form className="bg-white p-8 rounded shadow-md w-90">
              <h1 className="text-xl font-bold mb-6 text-center  font-mono">
                Time Trakcker Web Applicatio
              </h1>
              <h2 className="text-2xl font-bold mb-6 text-center  font-mono">
                Log In 
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="font-mono block text-gray-700 font-semibold mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=" w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className=" font-mono block text-gray-700 font-semibold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <p className="mb-2  text-blue-500 ">
                <Link to="/ForgotPassword">Reset password</Link>
              </p>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                onClick={signInWithEmail}
              >
                Login
              </button>
                <p className="text-gray-600 my-2 text-center">Or</p>
                <div className="google-blue text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer w-64 bg-blue-500"
                onClick={signInWithGoogle}
                >
        <svg viewBox="0 0 24 24" className="fill-current mr-3 w-6 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg>
        <span className="border-l border-gray-500 h-6 w-1 block"></span>
        <span className="pl-3">Sign up with Google</span>
    </div>
              {/* <button
                className="login-with-google-btn text-[16px] text-blue-500"
                onClick={signInWithGoogle}
              >
                Sign in with Google
              </button> */}
              <p className="mt-2 ">
                Don't have an account?{" "}
                <Link to="/signup" className=" text-blue-500">
                  Sign Up
                </Link>
              </p>
            </form>
            <ToastContainer />
          </div>
        )}
      </div>
    </>
  );
}

export default Login;

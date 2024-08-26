import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore"; // Change import for Firestore
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../firebase-config";
function Signup({ setUserData }) {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 
  //   e.preventDefault();

  //   // Basic validation
  //   try {
  //     if (!username || !country || !phoneNumber || !email || !password) {
  //       toast.error("Please All fields are required");
  //     }
  //     if (!/^[A-Za-z\s]+$/.test(username.trim())) {
  //       toast.error("Enter a valid name");
  //     }

  //     if (!/^[A-Za-z\s]+$/.test(country.trim())) {
  //       toast.error("Enter a valid country name");
  //     }

  //     if (!/\S+@\S+\.\S+/.test(email)) {
  //       toast.error("Enter a valid email address");
  //     }

  //     if (!/^\d+$/.test(phoneNumber.trim())) {
  //       toast.error("Enter a valid phone number");
  //     }

  //     if (password.length < 8) {
  //       toast.error("Password must be at least 8 characters long");
  //     }

  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password,
  //     );

  //     const user = userCredential.user;
  //     if (user) {
  //       // Update user profile
  //       await updateProfile(user, {
  //         displayName: username,
  //         phoneNumber: phoneNumber,
  //         email: email,
  //       });

  //       // Add user data to Firestore
  //       const docRef = await addDoc(collection(db, "userData"), {
  //         Name: username,
  //         Email: email,
  //         Country: country,
  //         Phone: phoneNumber
  //       });

  //       const userData = {
  //         id: docRef.id,
  //         Name: username,
  //         Email: email,
  //         Country: country,
  //         Phone: phoneNumber,
  //       };

  //       setUserData(userData);
  //       navigate("/login");
  //       toast.success("Signup Successful");
  //       console.log("Signup Successful");
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //     console.error("Error signing up:", error);
  //     toast.error("Signup error: ", error);
  //   }
  // };
  const handleSignup = async (e) => {
  e.preventDefault();

  // Basic validation
  if (!username || !country || !phoneNumber || !email || !password) {
    toast.error("All fields are required");
    return;
  }
  if (!/^[A-Za-z\s]+$/.test(username.trim())) {
    toast.error("Enter a valid name");
    return;
  }
  if (!/^[A-Za-z\s]+$/.test(country.trim())) {
    toast.error("Enter a valid country name");
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    toast.error("Enter a valid email address");
    return;
  }
  if (!/^\d+$/.test(phoneNumber.trim())) {
    toast.error("Enter a valid phone number");
    return;
  }
  if (password.length < 8) {
    toast.error("Password must be at least 8 characters long");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    if (user) {
      // Update user profile
      await updateProfile(user, {
        displayName: username,
      });

      // Add user data to Firestore
      const docRef = await addDoc(collection(db, "userData"), {
        Name: username,
        Email: email,
        Country: country,
        Phone: phoneNumber
      });

      const userData = {
        id: docRef.id,
        Name: username,
        Email: email,
        Country: country,
        Phone: phoneNumber,
      };

      setUserData(userData);
      navigate("/login");
      toast.success("Signup Successful");

    }
  } catch (error) {
    setError(error.message);
    console.error("Error signing up:", error);
    toast.error("Signup error: " + error.message);
  }
};
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <>
      <div className="signupPage h-screen flex items-center justify-center bg-gray-100 font-mono">
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
          <>
            <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
              <h2 className="text-xl font-semibold mb-4 text-center text-[rgb(44, 19, 56);]">
               Time Tracker Web Application
              </h2>
              <h2 className="text-2xl font-semibold mb-4 text-center font-mono">
                Sign Up 
              </h2>
              <form className="space-y-4 mb-4">
                <div>
                  <label className="font-mono block mb-1">Username:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-mono">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label>Country:</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label>Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Rest of the form fields */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  onClick={handleSignup}
                >
                  Signup
                </button>
                {error && (
                  <p className="text-red-500 text-[16px] my-4">{error}</p>
                )}
              </form>
              <Link
                to="/Login"
                className="text-blue-600 mt-2 border py-1 px-2 hover:underline text-[18px] "
              >
                Login here
              </Link>
            </div>
            <ToastContainer />
          </>
        )}
      </div>
    </>
  );
}

export default Signup;

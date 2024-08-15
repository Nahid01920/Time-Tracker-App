
// ForgotPassword.js
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const auth = getAuth();
  let navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Check your inbox!');
      console.log('Password reset email sent. Check your inbox!');
      // Optionally, add a delay before navigating
      setTimeout(() => {
        navigate("/Login");
      }, 3000);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error(errorCode, errorMessage);

      if (errorCode === 'auth/invalid-email') {
        setMessage('Invalid email format. Please enter a valid email address.');
      } else {
        setMessage(`Error: ${errorMessage}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-mono">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {/* Conditional rendering based on the presence of the message */}
        {!message ? (
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        ) : null}

        {!message ? (
          <button
            onClick={handleResetPassword}
            className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Reset Password
          </button>
        ) : null}

        <div className="text-red-600 my-4 text-[16px]">
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
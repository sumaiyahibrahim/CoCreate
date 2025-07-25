import React, { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

export default function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onAuth && onAuth();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(""); // Clear previous errors
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onAuth && onAuth();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <form onSubmit={handleAuth} style={{ maxWidth: "320px", margin: "auto", color: "#ddd" }}>
      <h2 style={{ textAlign: 'center' }}>{isLogin ? "Login" : "Sign Up"}</h2>
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={{
          width: "100%",
          padding: "10px",
          margin: "8px 0",
          borderRadius: "5px",
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={{
          width: "100%",
          padding: "10px",
          margin: "8px 0",
          borderRadius: "5px",
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      />

      {error && (
        <div style={{ color: "red", marginBottom: "10px", textAlign: 'center' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "10px"
        }}
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>

      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "transparent",
          color: "#007BFF",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          marginBottom: "10px",
          textDecoration: "underline"
        }}
      >
        {isLogin ? "Create account" : "Have an account? Login"}
      </button>

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Sign in with Google
      </button>
    </form>
  );
}

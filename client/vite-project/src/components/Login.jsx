
import React, { useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import axios from "axios";

import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Login = () => {
  const [state, setState] = useState("Login");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    setIsLoginOpen,
    backendUrl,
    setToken,
    setUser,
    setCredit
  } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let response;

      if (state === "Login") {
        response = await axios.post(
          `${backendUrl}/api/user/login`,
          {
            email,
            password,
          }
        );
      } else {
        response = await axios.post(
          `${backendUrl}/api/user/register`,
          {
            name,
            email,
            password,
          }
        );
      }

      const { data } = response;

      console.log("RESPONSE:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);

        setToken(data.token);
        setUser(data.user);
        setCredit(data.user.creditBalance);
        setIsLoginOpen(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setIsLoginOpen(false)}
          className="absolute right-5 top-5 cursor-pointer"
        >
          <X />
        </button>

        <div className="flex justify-center">
          <img
            src={assets.logo_icon}
            alt=""
            className="w-14"
          />
        </div>

        <h1 className="mt-4 text-center text-3xl font-bold">
          {state}
        </h1>

        <p className="mt-2 text-center text-gray-500">
          {state === "Login"
            ? "Login to continue"
            : "Create your account"}
        </p>

        {state === "Sign Up" && (
          <div className="mt-6">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-xl border p-3 outline-none"
              required
            />
          </div>
        )}

        <div className="mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none"
            required
          />
        </div>

        <div className="mt-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-xl border p-3 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {loading
            ? "Please wait..."
            : state === "Login"
            ? "Login"
            : "Create Account"}
        </button>

        <p className="mt-5 text-center">
          {state === "Login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            onClick={() =>
              setState(
                state === "Login"
                  ? "Sign Up"
                  : "Login"
              )
            }
            className="ml-2 cursor-pointer text-blue-600"
          >
            {state === "Login"
              ? "Sign Up"
              : "Login"}
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;


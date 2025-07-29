import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { setToken } from "../features/authSlice";
import { useAppDispatch } from "../hooks";
import { useLoginMutation } from "../services/api";

const Login: React.FC = () => {
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setToken(res.data));
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-sky-700 mb-6 text-center">
        Login
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
        required
      />
      <Button
        text={isLoading ? "Logging in..." : "Login"}
        className="w-full"
        isLoading={isLoading}
      />
      <div className="mt-4 text-center">
        <span className="text-sky-700">Don't have an account? </span>
        <Link
          to="/auth/register"
          className="text-sky-900 font-semibold hover:underline"
        >
          Register
        </Link>
      </div>
    </form>
  );
};

export default Login;

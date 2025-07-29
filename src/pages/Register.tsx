import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useRegisterMutation } from "../services/api";
import { useAppDispatch } from "../hooks";
import { setToken } from "../features/authSlice";

const Register: React.FC = () => {
  const [error, setError] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const res = await register({
        firstname,
        lastname,
        email,
        password,
      }).unwrap();
      dispatch(setToken(res.data));
      navigate("/");
    } catch (err: any) {
      setError(err?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-sky-700 mb-6 text-center">
        Register
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <input
        name="firstname"
        type="text"
        placeholder="First Name"
        className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
        required
      />
      <input
        name="lastname"
        type="text"
        placeholder="Last Name"
        className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
        required
      />
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
        text={isLoading ? "Registering..." : "Register"}
        className="w-full"
        isLoading={isLoading}
      />
      <div className="mt-4 text-center">
        <span className="text-sky-700">Already have an account? </span>
        <Link
          to="/login"
          className="text-sky-900 font-semibold hover:underline"
        >
          Login
        </Link>
      </div>
    </form>
  );
};

export default Register;

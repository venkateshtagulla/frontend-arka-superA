"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });
  const [invalid, setInvalid] = useState(false);
  const router = useRouter();
  const login = async (e) => {
    e.preventDefault();
    if (!payload.email || !payload.password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/user/login",
        payload
      );
      const { access_token, id_token, refresh_token } = response.data;

      document.cookie = `access_token=${access_token}; path=/; max-age=${
        60 * 60
      }`;
      document.cookie = `refresh_token=${refresh_token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;

      localStorage.setItem("refresh_token", access_token);
      const idPayload = JSON.parse(atob(id_token.split(".")[1]));

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: idPayload.email,
          sub: idPayload.sub,
        })
      );

      return router.push("/");
    } catch (error) {
      setInvalid(true);
    }
  };
  return (
    <div className="w-screen h-screen flex place-items-center justify-center bg-cyan-700">
      <div className="w-full max-w-130 h-130 bg-white border-2 border-[#ead9e4] rounded-4xl shadow-lg p-8 text-gray-800">
        <div className="w-full h-1/3 space-y-3 flex flex-col place-items-center justify-center">
          <p className="text-2xl font-semibold">Sign in to your Account</p>
          <p className="text-sm">Enter your email and password to login</p>
        </div>
        <form onSubmit={login} className="h-2/3 space-y-4">
          <div>
            <p className="text-xl text-gray-400">Email</p>
            <input
              type="email"
              value={payload.email}
              onChange={(e) => {
                setInvalid(false);
                setPayload((old) => ({ ...old, email: e.target.value }));
              }}
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-gray-500"
              placeholder="Enter E-Mail"
            />
            {invalid && (
              <span className="text-red-500 text-sm">Invalid credentials</span>
            )}
          </div>
          <div>
            <p className="text-xl text-gray-400">Password</p>
            <input
              type="password"
              value={payload.password}
              onChange={(e) => {
                setInvalid(false);
                setPayload((old) => ({ ...old, password: e.target.value }));
              }}
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-gray-500"
              placeholder="Enter Password"
            />
            {invalid && (
              <span className="text-red-500 text-sm">Invalid credentials</span>
            )}
          </div>
          <button
            type="submit"
            className={`w-full border border-gray-200 bg-linear-to-r ${
              !payload.email || !payload.password
                ? "bg-gray-300"
                : "from-[#1B6687] to-[#209CBB]"
            } text-white text-xl p-4 rounded-lg`}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

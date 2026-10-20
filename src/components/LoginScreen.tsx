import { useState } from "react";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onRegister: () => void;
}

export default function LoginScreen({
  onLogin,
  onRegister,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
  <h1 className="text-3xl font-bold text-center mb-6">
    Login
  </h1>

  <form
    onSubmit={(e) => {
      e.preventDefault();
      onLogin(email, password);
    }}
  >
    <input
      type="email"
      placeholder="Email"
      className="w-full border p-3 rounded-lg mb-4"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      autoComplete="email"
    />

    <input
      type="password"
      placeholder="Password"
      className="w-full border p-3 rounded-lg mb-6"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      autoComplete="current-password"
    />

    <button
      type="submit"
      className="w-full bg-purple-600 text-white p-3 rounded-lg"
    >
      Login
    </button>
  </form>

  <button
    type="button"
    className="mt-4 w-full text-purple-600"
    onClick={onRegister}
  >
    Create Account
  </button>
</div>
    </div>
  );
}
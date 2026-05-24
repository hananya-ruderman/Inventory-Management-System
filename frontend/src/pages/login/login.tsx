import { useEffect, useState } from "react";
import { login } from "../../api/loginApi";
import { useNavigate } from "react-router";
import "./login.css";
import { useUser } from "../../state/user";

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();
  const [error, setError] = useState<Error | null>(null);

  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    if (!password || !username) {
      setError(new Error("Password and username are required"));
      return;
    }
    try {
      const user = await login(username as string, password as string);
      setCurrentUser(user.username);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
        setError(error);
      } else {
        console.error("Login failed:", error);
        setError(new Error("An unknown error occurred"));
      }
    }
  }

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-item">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="form-item">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
        </div>
        {error && <p>{error.message}</p>}
        <button type="submit" className="form-item">
          Login
        </button>
        <label htmlFor="register-link">Don't have an account?</label>
        <button
          id="register-link"
          className="form-item"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </form>
    </div>
  );
}

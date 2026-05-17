import {useState} from 'react'
import { login } from '../../api/loginApi';
import { useNavigate } from 'react-router';
import './login.css'
import {useUser} from '../../state/user';

export default function Login() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();
  const [error, setError] = useState<Error | null>(null);

    async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const id = formData.get('id');
        const username = formData.get('username');
        if (!id || !username) {
            setError(new Error('Id and username are required'));
            return;
        }
        try {
            const user = await login(id as string, username as string);
            setCurrentUser(user);
        } catch (error) {
          if (error instanceof Error) {
            console.error('Login failed:', error.message);
            setError(error);
          } else {
            console.error('Login failed:', error);
            setError(new Error('An unknown error occurred'));
          }
        }
    
      }
    if (currentUser) {
      navigate('/dashboard');
    }

    return (
        <div className="login-container">
          <h1 >Login</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-item">
              <label htmlFor="id">Id</label>
              <input type="text" id="id" name="id" />
            </div>
            <div className="form-item">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" />
            </div>
            {error && <p>{error.message}</p>}
            <button type="submit" className="form-item">Login</button>
            <label htmlFor="register-link">Don't have an account?</label>
            <button id="register-link" className="form-item" onClick={() => navigate('/register')}>Register</button>
        </form>
    </div>
  );
}
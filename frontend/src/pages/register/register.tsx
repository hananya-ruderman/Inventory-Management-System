import {register} from "../../api/registerApi";
import { useNavigate } from "react-router";
import { useState } from "react";
import './register.css';


export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'user'>('user');
    const navigate = useNavigate();

    async function handleRegister() {

        if (!username || !password ) {
            alert('Username and password are required');
            return;
        }
        try {
            await register({ username, password, role });
            navigate('/login');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Registration failed:', error.message);
                alert(`Registration failed: ${error.message}`);
            } else {
                console.error('Registration failed:', error);
                alert('Registration failed: An unknown error occurred');
            }
        }
    }

    return (
        <div className="register-container">
            <h1>Register</h1>
            <div className="content-item">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'user')}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button onClick={handleRegister}>Register</button>
            <button onClick={() => navigate('/login')}>Back to Login</button>
            </div>
        </div>
    );
}
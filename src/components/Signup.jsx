import React from 'react';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';


const Signup = ({ setUser }) => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });


    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        e.preventDefault();
        
        const {name, value} = e.target;

        setForm({...form, [name]: value});

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users',
                {method: 'POST',
                headers: {'Content-Type': 'application/json'

                },
                body: JSON.stringify(form)
            })

            if (!response.ok) {
                throw new Error('Registration Failed');
            }


            const data = await response.json();
            // Token can be stored in local storage 

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);

            setUser({ token: data.token, username: data.user.username });


            navigate('/');
        }

        catch(err) {
            setError(err.message);
            return;
        }


    };

    return (
        <div>
            <h1>Register</h1>
            {error && <div className='alert'>{error}</div>}
            <form onSubmit={handleSubmit}>
                
                <label>Username: </label>
                <input type="text" id='username' name="username" value={form.username} onChange={handleChange} required />

                <label>Email: </label>
                <input type="email" id='email' name="email" value={form.email} onChange={handleChange} required />

                <label>Password: </label>
                <input type="password" id='password' name="password" value={form.password} onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>

        </div>
    );

}
    export default Signup;

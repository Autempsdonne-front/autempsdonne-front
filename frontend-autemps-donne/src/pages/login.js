import React, { useState } from 'react';
import '../css/signup.css';  

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://au-temps-donne-api.onrender.com/api/admin/login-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          mot_de_passe: password
        })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('email', email); 
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur est survenue lors de la connexion.');
    }
  };

  return (
    <div id="body">
    <img src={require("../assets/logo.png")} alt="Votre Logo" className="logo" id="logo-light" height="80px"/>
    <div className="login-container">
      <h2>Bienvenue Administrateur !</h2>

      <form onSubmit={handleSubmit} id="loginForm" >
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit">Connexion</button>
        </div>
        <p>Mot de passe oublié ?</p>
        <a href="#" className="forgot-password">Changer mon mot de passe</a>
      </form>
    </div>
    </div>
  );
};

export default Login;

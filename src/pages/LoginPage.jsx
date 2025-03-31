import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPage.css";

const API_URL = process.env.REACT_APP_API_URL;

function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, {
        usuario,
        password,
      });
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario", usuario);

        console.log("Usuario guardado en localStorage:", usuario);
        
        navigate("/home");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError("Error al iniciar sesión. Intenta de nuevo.");
    }
  };

  return (
    <div className="login-container">
      <div className="overlay">
        <div className="login-box">
          <h2 className="text-center mb-4">Bienvenido a Administracion de Series</h2>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;



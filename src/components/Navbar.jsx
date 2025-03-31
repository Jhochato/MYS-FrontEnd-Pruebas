import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/home">Series Animadas</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link" to="/actores">Actores</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/directores">Directores</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/generos">Géneros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/paises">Países</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/peliculas">Películas</Link></li>
          </ul>
          <button className="btn btn-danger ms-auto" onClick={handleLogout}>Salir</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


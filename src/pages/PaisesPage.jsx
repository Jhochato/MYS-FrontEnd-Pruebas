import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/PaisPage.css";

const API_URL = process.env.REACT_APP_API_URL;

function Paises() {
  const [paises, setPaises] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState("");

  useEffect(() => {
    cargarPaises();
  }, []);

  const cargarPaises = async () => {
    try {
      const response = await axios.get(`${API_URL}/paises`);
      setPaises(response.data);
    } catch (error) {
      console.error("Error al cargar los países:", error);
    }
  };

  const eliminarPais = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este genero?")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/paises/${id}`);
      setPaises(paises.filter((pais) => pais.id !== id))
      setErrorMensaje("");
      alert("Pais eliminado correctamente.");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMensaje(error.response.data.message);
      } else {
        setErrorMensaje("Ocurrió un error inesperado al eliminar el pais.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="pais-page-container">
        <h2>Gestión de Países</h2>
        {errorMensaje && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {errorMensaje}
            <button type="button" className="btn-close" onClick={() => setErrorMensaje("")}></button>
          </div>
        )}
        <Link to="/paises/nuevopais" className="btn btn-primary mb-3">Nuevo País</Link>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paises.map((pais) => (
              <tr key={pais.id}>
                <td>{pais.nombre}</td>
                <td className="button-group">
                  <Link to={`/paises/editarpais/${pais.id}`} className="btn btn-warning me-2">Editar</Link>
                  <button onClick={() => eliminarPais(pais.id)} className="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Paises;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/DirectoresPage.css";

const API_URL = process.env.REACT_APP_API_URL;

const DirectoresPage = () => {
  const [directores, setDirectores] = useState([]);
  const [paises, setPaises] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState("");

  useEffect(() => {
    cargarDirectores();
    cargarPaises();
  }, []);

  const cargarDirectores = async () => {
    try {
      const response = await axios.get(`${API_URL}/directores`);
      setDirectores(response.data);
    } catch (error) {
      console.error("Error al cargar directores:", error);
    }
  };

  const cargarPaises = async () => {
    try {
      const response = await axios.get(`${API_URL}/paises`);
      setPaises(response.data);
    } catch (error) {
      console.error("Error al cargar países:", error);
    }
  };

  const obtenerNombrePais = (paisId) => {
    const pais = paises.find((pais) => pais.id === paisId);
    return pais ? pais.nombre : "Desconocido";
  };

  const eliminarDirector = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este director?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/directores/${id}`);
      setDirectores(directores.filter((director) => director.id !== id));
      setErrorMensaje("");
      alert("Director eliminado correctamente.");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMensaje(error.response.data.message);
      } else {
        setErrorMensaje("Ocurrió un error inesperado al eliminar el director.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="director-page-container">
        <h1>Gestión de Directores</h1>
        {errorMensaje && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {errorMensaje}
            <button type="button" className="btn-close" onClick={() => setErrorMensaje("")}></button>
          </div>
        )}
        <Link to="/directores/nuevodirector" className="btn btn-primary mb-3">Nuevo Director</Link>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {directores.map((director) => (
              <tr key={director.id}>
                <td>{director.nombre}</td>
                <td>{director.apellidos}</td>
                <td>{obtenerNombrePais(director.paisId)}</td>
                <td className="button-group">
                  <Link to={`/directores/editardirector/${director.id}`} className="btn btn-warning">Editar</Link>
                  <button onClick={() => eliminarDirector(director.id)} className="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DirectoresPage;


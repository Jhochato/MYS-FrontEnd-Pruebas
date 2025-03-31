import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/ActoresPage.css";

const API_URL = process.env.REACT_APP_API_URL;

const ActoresPage = () => {
  const [actores, setActores] = useState([]);
  const [paises, setPaises] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState("");

  useEffect(() => {
    cargarActores();
    cargarPaises();
  }, []);

  const cargarActores = async () => {
    try {
      const response = await axios.get(`${API_URL}/actores`);
      setActores(response.data);
    } catch (error) {
      console.error("Error al cargar actores:", error);
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

  const eliminarActor = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este actor?")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/actores/${id}`);
      setActores(actores.filter((actor) => actor.id !== id))
      setErrorMensaje("");
      alert("Actor eliminado correctamente."); 
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMensaje(error.response.data.message);
      } else {
        setErrorMensaje("Ocurrió un error inesperado al eliminar el actor.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="actor-page-container">
        <h1>Gestión de Actores</h1>
        {errorMensaje && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {errorMensaje}
            <button type="button" className="btn-close" onClick={() => setErrorMensaje("")}></button>
          </div>
        )}
        <Link to="/actores/nuevoactor" className="btn btn-primary mb-3">Nuevo Actor</Link>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actores.map(actor => (
              <tr key={actor.id}>
                <td>{actor.nombre}</td>
                <td>{actor.apellidos}</td>
                <td>{obtenerNombrePais(actor.paisId)}</td>
                <td className="button-group">
                  <Link to={`/actores/editaractor/${actor.id}`} className="btn btn-warning">Editar</Link>
                  <button onClick={() => eliminarActor(actor.id)} className="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActoresPage;


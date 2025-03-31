import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/GenerosPage.css"

const API_URL = process.env.REACT_APP_API_URL;

const GenerosPage = () => {
  const [generos, setGeneros] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState("");

  useEffect(() => {
    cargarGeneros();
  }, []);

  const cargarGeneros = async () => {
    try {
      const response = await axios.get(`${API_URL}/generos`);
      setGeneros(response.data);
    } catch (error) {
      console.error("Error al cargar los géneros:", error);
    }
  };

  const eliminarGenero = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este genero?")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/generos/${id}`);
      setGeneros(generos.filter((genero) => genero.id !== id))
      setErrorMensaje("");
      alert("Genero eliminado correctamente.");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMensaje(error.response.data.message);
      } else {
        setErrorMensaje("Ocurrió un error inesperado al eliminar el genero.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="genero-page-container">
        <h1>Gestión de Géneros</h1>
        {errorMensaje && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {errorMensaje}
            <button type="button" className="btn-close" onClick={() => setErrorMensaje("")}></button>
          </div>
        )}
        <Link to="/generos/nuevogenero" className="btn btn-primary mb-3">Nuevo Género</Link>
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {generos.map((genero) => (
              <tr key={genero.id}>
                <td>{genero.nombre}</td>
                <td className="button-group">
                  <Link to={`/generos/editargenero/${genero.id}`} className="btn btn-warning">Editar</Link>
                  <button onClick={() => eliminarGenero(genero.id)} className="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default GenerosPage;

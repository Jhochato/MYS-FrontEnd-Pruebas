import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/EditGeneroForm.css"

const API_URL = process.env.REACT_APP_API_URL;

function EditGeneroForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/generos/${id}`)
        .then((response) => {
          setNombre(response.data.nombre);
        })
        .catch((error) => console.error("Error al cargar generos:", error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const genero = { id, nombre };

    try {
      if (id) {
        await axios.put(`${API_URL}/generos/${id}`, genero);
        alert("Genero actualizado con éxito");
      } else {
        await axios.post(`${API_URL}/generos`, genero);
        alert("Genero creado con éxito");
      }
      navigate("/generos");
    } catch (error) {
      console.error("Error al guardar el Genero:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="genero-form-container">
        <h2>{id ? "Editar Género" : "Nuevo Género"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre del Género</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              {id ? "Guardar Cambios" : "Crear Género"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/generos")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditGeneroForm;

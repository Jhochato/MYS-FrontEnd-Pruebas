import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/EditPaisForm.css"

const API_URL = process.env.REACT_APP_API_URL;

function EditPaisForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/paises/${id}`)
        .then((response) => {
          setNombre(response.data.nombre);
        })
        .catch((error) => console.error("Error al cargar país:", error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pais = { id, nombre };

    try {
      if (id) {
        await axios.put(`${API_URL}/paises/${id}`, pais);
        alert("País actualizado con éxito");
      } else {
        await axios.post(`${API_URL}/paises`, pais);
        alert("País creado con éxito");
      }
      navigate("/paises");
    } catch (error) {
      console.error("Error al guardar el país:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="pais-form-container">
        <h2>{id ? "Editar País" : "Nuevo País"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre del País</label>
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
              {id ? "Guardar Cambios" : "Crear Pais"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/paises")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPaisForm;

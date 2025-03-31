import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/EditActorForm.css"

const API_URL = process.env.REACT_APP_API_URL;

const EditActorForm = () => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [paisId, setPaisId] = useState("");
  const [paises, setPaises] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [paisError, setPaisError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const response = await axios.get(`${API_URL}/paises`);
        setPaises(response.data);
      } catch (error) {
        console.error("Error al cargar países:", error);
      }
    };

    cargarPaises();

    if (id) {
      const cargarActor = async () => {
        try {
          const response = await axios.get(`${API_URL}/actores/${id}`);
          const actor = response.data;
          setNombre(actor.nombre);
          setApellidos(actor.apellidos);
          setPaisId(actor.paisId);
          setIsEdit(true);
        } catch (error) {
          console.error("Error al cargar actor:", error);
        }
      };
      cargarActor();
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!paisId) {
      setPaisError("Debes seleccionar un país.");
      return;
    } else {
      setPaisError("");
    }

    const paisSeleccionado = paises.find((pais) => pais.id === parseInt(paisId));

    if (!paisSeleccionado) {
      console.error("Error: País no encontrado");
      return;
    }

    const actor = {
      id,
      nombre,
      apellidos,
      paisId,
      pais: {
        id: paisSeleccionado.id,
        nombre: paisSeleccionado.nombre
      }
    };

    console.log(actor);

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/actores/${id}`, actor);
        alert("Actor actualizado con éxito");
      } else {
        await axios.post(`${API_URL}/actores`, actor);
        alert("Actor creado con éxito");
      }
      navigate("/actores");
    } catch (error) {
      console.error("Error al guardar actor:", error.response || error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="actor-form-container">
        <h1>{isEdit ? "Editar Actor" : "Nuevo Actor"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombres</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value) } required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label">Apellidos</label>
            <input
              type="text"
              className="form-control"
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value) } required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pais" className="form-label">País de Origen</label>
            <select
              className="form-control"
              id="pais"
              value={paisId}
              onChange={(e) => setPaisId(e.target.value)}
            >
              <option value="">Seleccionar País</option>
              {paises.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.nombre}
                </option>
              ))}
            </select>
            {paisError && <small className="text-danger">{paisError}</small>}
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Guardar Cambios" : "Crear Actor"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/actores")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActorForm;


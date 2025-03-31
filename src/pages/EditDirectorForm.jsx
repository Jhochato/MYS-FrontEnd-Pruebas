import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/EditDirectorForm.css"

const API_URL = process.env.REACT_APP_API_URL;

const EditDirectorForm = () => {
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
      const cargarDirector = async () => {
        try {
          const response = await axios.get(`${API_URL}/directores/${id}`);
          const director = response.data;
          setNombre(director.nombre);
          setApellidos(director.apellidos);
          setPaisId(director.paisId);
          setIsEdit(true);
        } catch (error) {
          console.error("Error al cargar director:", error);
        }
      };
      cargarDirector();
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

    const director = {
      id,
      nombre,
      apellidos,
      paisId,
      pais: {
        id: paisSeleccionado.id,
        nombre: paisSeleccionado.nombre
      }
    };

    console.log(director);

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/directores/${id}`, director);
        alert("Director actualizado con éxito");
      } else {
        await axios.post(`${API_URL}/directores`, director);
        alert("Director creado con éxito");
      }
      navigate("/directores");
    } catch (error) {
      console.error("Error al guardar director:", error.response || error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="director-form-container">
        <h1>{isEdit ? "Editar Director" : "Nuevo Director"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)} required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label">Apellidos</label>
            <input
              type="text"
              className="form-control"
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)} required
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
              {isEdit ? "Guardar Cambios" : "Crear Director"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/directores")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDirectorForm;


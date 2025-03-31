import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getPeliculaById, updatePelicula } from "../services/peliculasService";
import { getGeneros } from "../services/generosService";
import { getPaises } from "../services/paisesService";
import { getDirectores } from "../services/directoresService";
import { getActores } from "../services/actoresService";
import "../styles/EditPeliculaForm.css";

function EditPeliculaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [peliculaData, setPeliculaData] = useState(null);
  const [generos, setGeneros] = useState([]);
  const [paises, setPaises] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [actores, setActores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pelicula, generosData, paisesData, directoresData, actoresData] = await Promise.all([
          getPeliculaById(id),
          getGeneros(),
          getPaises(),
          getDirectores(),
          getActores()
        ]);

        setPeliculaData(pelicula);
        setGeneros(generosData);
        setPaises(paisesData);
        setDirectores(directoresData);
        setActores(actoresData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPeliculaData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (e, field) => {
    const { value } = e.target;
    const selectedOption = (field === "genero" ? generos :
      field === "pais" ? paises :
        field === "director" ? directores :
          null)
      ?.find(item => item.id === parseInt(value));

    setPeliculaData(prevState => ({
      ...prevState,
      [field]: selectedOption ? { id: selectedOption.id, nombre: selectedOption.nombre } : prevState[field]
    }));
  };

  const handleActorsChange = (e) => {
    const selectedActorIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    const selectedActors = actores.filter(actor => selectedActorIds.includes(actor.id));

    setPeliculaData(prevState => ({
      ...prevState,
      actores: selectedActors
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, titulo, reseña, imagenPortada, codigoTrailer, genero, pais, director, actores } = peliculaData;

    const updatedPelicula = {
      id,
      titulo,
      reseña,
      imagenPortada,
      codigoTrailer,
      genero: {
        id: genero?.id ?? peliculaData.generoId ?? null,
        nombre: genero?.nombre ?? peliculaData.genero ?? ""
      },
      pais: {
        id: pais?.id ?? peliculaData.paisId ?? null,
        nombre: pais?.nombre ?? peliculaData.pais ?? ""
      },
      director: {
        id: director?.id ?? peliculaData.directorId ?? null,
        nombre: director?.nombre ?? peliculaData.directorNombre ?? "",
        apellidos: director?.apellidos ?? peliculaData.directorApellido ?? "",
        pais: {
          id: director?.pais?.id ?? peliculaData.directorPaisId ?? null,
          nombre: director?.pais?.nombre ?? peliculaData.directorPaisNombre ?? ""
        }
      },
      actoresSeleccionados: actores?.map(actor => actor.id) ?? peliculaData?.actores?.map(actor => actor.id) ?? []
    };

    console.log("Datos cargados:", JSON.stringify(peliculaData, null, 2));
    console.log("Datos enviados:", JSON.stringify(updatedPelicula, null, 2));

    try {
      await updatePelicula(id, updatedPelicula);
      alert("Película actualizada con éxito");
      navigate("/peliculas");
    } catch (error) {
      console.error("Error al actualizar película:", error);
      alert("Hubo un error al actualizar la película. Inténtalo de nuevo.");
    }
  };

  if (loading) return <div>Cargando datos...</div>;

  return (
    <div>
      <Navbar />
      <div className="pelicula-form-container">
        <h2>Editar Película</h2>
        <form onSubmit={handleSubmit} className="pelicula-form">
          <div className="form-group">
            <label>Título:</label>
            <input type="text" name="titulo" value={peliculaData?.titulo || ""} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Reseña:</label>
            <textarea name="reseña" value={peliculaData?.reseña || ""} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Imagen de Portada (URL):</label>
              <input type="text" name="imagenPortada" value={peliculaData?.imagenPortada || ""} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Código del Tráiler:</label>
              <input type="text" name="codigoTrailer" value={peliculaData?.codigoTrailer || ""} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cambiar Género:</label>
              <select name="genero" onChange={(e) => handleSelectChange(e, "genero")}>
                <option value="">Selecciona un nuevo género</option>
                {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Cambiar País:</label>
              <select name="pais" onChange={(e) => handleSelectChange(e, "pais")}>
                <option value="">Selecciona un nuevo país</option>
                {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Cambiar Director:</label>
            <select name="director" onChange={(e) => handleSelectChange(e, "director")}>
              <option value="">Selecciona un nuevo director</option>
              {directores.map(d => <option key={d.id} value={d.id}>{`${d.nombre} ${d.apellidos}`}</option>)}
            </select>
          </div>

          <div className="actor-selection">
            <div className="form-group">
              <label>Seleccionar Nuevos Actores:</label>
              <select multiple name="actores" onChange={handleActorsChange}>
                {actores.map(a => <option key={a.id} value={a.id}>{`${a.nombre} ${a.apellidos}`}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Actores Actuales:</label>
              <ul>
                {peliculaData?.actores?.length > 0 ? peliculaData.actores.map(actor => (
                  <li key={actor.id}>{`${actor.nombre} ${actor.apellidos}`}</li>
                )) : <li>Sin actores</li>}
              </ul>
            </div>
          </div>

          <button type="submit">Actualizar Película</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/peliculas")}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

export default EditPeliculaForm;

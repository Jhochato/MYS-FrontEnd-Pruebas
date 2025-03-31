import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { getPeliculas, deletePelicula } from "../services/peliculasService";
import "../styles/PeliculasPage.css";

const API_URL = process.env.REACT_APP_API_URL;
const ITEMS_PER_PAGE = 10;

function Peliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [paises, setPaises] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const data = await getPeliculas();
        setPeliculas(data);
      } catch (error) {
        alert("Hubo un problema al cargar las películas. Intenta nuevamente.");
      } finally {
        setCargando(false);
      }
    };
    fetchPeliculas();
    cargarPaises();
    cargarGeneros();
  }, []);

  const cargarPaises = async () => {
    try {
      const response = await axios.get(`${API_URL}/paises`);
      setPaises(response.data);
    } catch (error) {
      console.error("Error al cargar países:", error);
    }
  };

  const cargarGeneros = async () => {
    try {
      const response = await axios.get(`${API_URL}/generos`);
      setGeneros(response.data);
    } catch (error) {
      console.error("Error al cargar generos:", error);
    }
  };

  const obtenerNombreGenero = (generoId) => {
    const genero = generos.find((g) => g.id === generoId);
    return genero ? genero.nombre : "Género Desconocido";
  };

  const obtenerNombrePais = (paisId) => {
    const pais = paises.find((p) => p.id === paisId);
    return pais ? pais.nombre : "País Desconocido";
  };

  const eliminarPelicula = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta película?")) return;
    setEliminando(id);
    try {
      await deletePelicula(id);
      setPeliculas((prevPeliculas) => prevPeliculas.filter((p) => p.id !== id));
      alert("Película eliminada correctamente");
    } catch (error) {
      alert("No se pudo eliminar la película. Inténtalo más tarde.");
    } finally {
      setEliminando(null);
    }
  };

  const indexOfLastItem = paginaActual * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const peliculasPaginadas = peliculas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPaginas = Math.ceil(peliculas.length / ITEMS_PER_PAGE);

  return (
    <div>
      <Navbar />
      <div className="pelicula-page-container">
        <h1>Gestión de Películas</h1>
        <Link to="/peliculas/nuevapelicula" className="btn btn-primary">
          Nueva Película
        </Link>

        {cargando ? (
          <p>Cargando películas...</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Miniatura</th>
                  <th>Título</th>
                  <th>País</th>
                  <th>Género</th>
                  <th>Tráiler</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {peliculasPaginadas.map(
                  (pelicula) =>
                    pelicula?.id && (
                      <tr key={pelicula.id}>
                        <td>
                          {pelicula.imagenPortada && (
                            <img
                              src={pelicula.imagenPortada}
                              alt={pelicula.titulo}
                              className="miniatura"
                            />
                          )}
                        </td>
                        <td>{pelicula.titulo}</td>
                        <td>{obtenerNombrePais(pelicula.paisId)}</td>
                        <td>{obtenerNombreGenero(pelicula.generoId)}</td>
                        <td>
                          {pelicula.codigoTrailer && (
                            <a
                              href={`https://www.youtube.com/watch?v=${pelicula.codigoTrailer}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-info"
                            >
                              Ver Tráiler
                            </a>
                          )}
                        </td>
                        <td className="button-group">
                          <Link
                            to={`/peliculas/editarpelicula/${pelicula.id}`}
                            className="btn btn-warning"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => eliminarPelicula(pelicula.id)}
                            className="btn btn-danger"
                            disabled={eliminando === pelicula.id}
                          >
                            {eliminando === pelicula.id
                              ? "Eliminando..."
                              : "Eliminar"}
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
            <td className=".pagination-container button-group">
              <div className="pagination">
                <button
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="btn btn-secondary">Anterior</button>
                <span>
                  Página {paginaActual} de {totalPaginas}
                </span>
                <button
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="btn btn-secondary">Siguiente</button>
              </div>
            </td>
          </>
        )}
      </div>
    </div>
  );
}

export default Peliculas;


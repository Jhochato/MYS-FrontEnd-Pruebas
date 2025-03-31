import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addPelicula } from "../services/peliculasService";
import { getGeneros } from "../services/generosService";
import { getPaises } from "../services/paisesService";
import { getDirectores } from "../services/directoresService";
import { getActores } from "../services/actoresService";
import "../styles/AddPeliculaForm.css";

function CrearPeliculaForm() {
    const [peliculaData, setDataPelicula] = useState({
        titulo: "",
        resena: "",
        imagenPortada: "",
        codigoTrailer: "",
        generoId: "",
        generoNombre: "",
        paisId: "",
        paisNombre: "",
        directorId: "",
        directorNombre: "",
        actoresSeleccionados: []
    });

    const [generos, setGeneros] = useState([]);
    const [paises, setPaises] = useState([]);
    const [directores, setDirectores] = useState([]);
    const [actores, setActores] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const extractYouTubeID = (url) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : url;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [generosRes, paisesRes, directoresRes, actoresRes] = await Promise.all([
                    getGeneros(),
                    getPaises(),
                    getDirectores(),
                    getActores()
                ]);

                setGeneros(generosRes);
                setPaises(paisesRes);
                setDirectores(directoresRes);
                setActores(actoresRes);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "codigoTrailer") {
            setDataPelicula(prevState => ({
                ...prevState,
                codigoTrailer: extractYouTubeID(value)
            }));
        } else if (name === "generoId") {
            const generoSeleccionado = generos.find(g => g.id === Number(value));
            setDataPelicula(prevState => ({
                ...prevState,
                generoId: generoSeleccionado.id,
                generoNombre: generoSeleccionado.nombre
            }));
        } else if (name === "paisId") {
            const paisSeleccionado = paises.find(p => p.id === Number(value));
            setDataPelicula(prevState => ({
                ...prevState,
                paisId: paisSeleccionado.id,
                paisNombre: paisSeleccionado.nombre
            }));
        } else if (name === "directorId") {
            const directorSeleccionado = directores.find(d => d.id === Number(value));
            setDataPelicula(prevState => ({
                ...prevState,
                directorId: directorSeleccionado.id,
                directorNombre: directorSeleccionado.nombre
            }));
        } else {
            setDataPelicula(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const actorId = Number(value);

        setDataPelicula(prevState => {
            const actoresSeleccionados = checked
                ? [...prevState.actoresSeleccionados, actorId]
                : prevState.actoresSeleccionados.filter(id => id !== actorId);
            return { ...prevState, actoresSeleccionados };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const generoSeleccionado = generos.find(g => g.id === parseInt(peliculaData.generoId)) || {};
        const paisSeleccionado = paises.find(p => p.id === parseInt(peliculaData.paisId)) || {};
        const directorSeleccionado = directores.find(d => d.id === parseInt(peliculaData.directorId)) || {};

        const actoresSeleccionados = peliculaData.actoresSeleccionados
            .map(id => actores.find(a => a.id === parseInt(id)))
            .filter(a => a !== undefined)
            .map(a => ({ id: a.id }));

        const insertPelicula = {
            titulo: peliculaData.titulo,
            reseña: peliculaData.resena,
            imagenPortada: peliculaData.imagenPortada,
            codigoTrailer: peliculaData.codigoTrailer,
            genero: {
                id: generoSeleccionado.id,
                nombre: generoSeleccionado.nombre
            },
            pais: {
                id: paisSeleccionado.id,
                nombre: paisSeleccionado.nombre
            },
            director: {
                id: directorSeleccionado.id,
                nombre: directorSeleccionado.nombre || "",
                apellidos: directorSeleccionado.apellidos || "",
                pais: {
                    id: directorSeleccionado.pais?.id || paisSeleccionado.id,
                    nombre: directorSeleccionado.pais?.nombre || paisSeleccionado.nombre
                }
            },
            actores: actoresSeleccionados.map(a => ({
                id: a.id,
                nombre: a.nombre,
                apellidos: a.apellidos || ""
            }))
        };

        console.log("Datos enviados:", JSON.stringify(insertPelicula, null, 2));
        try {
            await addPelicula(insertPelicula);
            alert("Película creada con éxito");
            navigate("/peliculas");
        } catch (error) {
            console.error("Error al guardar película:", error);
            alert("Hubo un error al guardar la película. Inténtalo de nuevo.");
        }
    };

    if (loading) return <div>Cargando datos...</div>;

    return (
        <div>
            <Navbar />
            <div className="pelicula-form-container">
                <h2>Agregar Película</h2>
                <form onSubmit={handleSubmit}>
                    <div className="title-review-group">
                        <div className="form-group">
                            <label>Título:</label>
                            <input type="text" name="titulo" value={peliculaData.titulo} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Reseña:</label>
                            <input type="text" name="resena" value={peliculaData.resena} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="image-trailer-group">
                        <div className="form-group">
                            <label>Imagen de Portada:</label>
                            <input type="text" name="imagenPortada" value={peliculaData.imagenPortada} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Código de Trailer:</label>
                            <input type="text" name="codigoTrailer" value={peliculaData.codigoTrailer} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="genre-country-group">
                        <div className="form-group">
                            <label>Género:</label>
                            <select name="generoId" value={peliculaData.generoId || ""} onChange={handleChange} required>
                                <option value="">Selecciona un género</option>
                                {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>País:</label>
                            <select name="paisId" value={peliculaData.paisId} onChange={handleChange} required>
                                <option value="">Selecciona un país</option>
                                {paises.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="director-actores-group">
                        <div className="form-group">
                            <label>Director:</label>
                            <select name="directorId" value={peliculaData.directorId} onChange={handleChange} required>
                                <option value="">Selecciona un director</option>
                                {directores.map(d => <option key={d.id} value={d.id}>{`${d.nombre} ${d.apellidos}`}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Actores:</label>
                            <div className="actores-container">
                                {actores.map((a, index) => (
                                    <div key={a.id} className="actor">
                                        <input
                                            type="checkbox"
                                            value={a.id}
                                            onChange={handleCheckboxChange}
                                            checked={peliculaData.actoresSeleccionados.includes(Number(a.id))}
                                        />
                                        <span>{a.nombre} {a.apellidos}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="button-group">
                        <button type="submit" className="btn btn-primary">Crear Película</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate("/peliculas")}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CrearPeliculaForm;

import apiClient from './apiService';

export const getPeliculas = async () => {
  try {
    const response = await apiClient.get('/peliculas');
    return response.data;
  } catch (error) {
    console.error("Error al obtener las películas:", error);
    throw new Error("No se pudieron cargar las películas. Inténtalo más tarde.");
  }
};

export const getPeliculaById = async (id) => {
  try {
    const response = await apiClient.get(`/peliculas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la película con ID ${id}:`, error);
    throw new Error("No se pudo cargar la película. Verifica el ID e inténtalo de nuevo.");
  }
};

export const addPelicula = async (peliculaData) => {
  try {
    const peliculaCorregida = {
      titulo: peliculaData.titulo,
      reseña: peliculaData.reseña, 
      imagenPortada: peliculaData.imagenPortada,
      codigoTrailer: peliculaData.codigoTrailer,
      genero: { 
        id: peliculaData.genero?.id, 
        nombre: peliculaData.genero?.nombre 
      }, 
      pais: { 
        id: peliculaData.pais?.id, 
        nombre: peliculaData.pais?.nombre 
      }, 
      director: { 
        id: peliculaData.director?.id, 
        nombre: peliculaData.director?.nombre,
        apellidos: peliculaData.director?.apellidos,
        pais: {
          id: peliculaData.director?.pais?.id,
          nombre: peliculaData.director?.pais?.nombre
        }
      }, 
      actoresSeleccionados: Array.isArray(peliculaData.actores) 
        ? peliculaData.actores.map(a => Number(a.id)) 
        : []
    };

    console.log("JSON final antes de enviar a la API:", JSON.stringify(peliculaCorregida, null, 2));

    const response = await apiClient.post('/peliculas', peliculaCorregida);
    return response.data;
  } catch (error) {
    console.error("Error al agregar la película:", error);
    throw new Error("No se pudo agregar la película. Revisa los datos ingresados.");
  }
};

export const updatePelicula = async (id, peliculaData) => {
  try {
    const peliculaCorregida = {
      ...peliculaData,
      actoresSeleccionados: Array.isArray(peliculaData.actoresSeleccionados) 
        ? peliculaData.actoresSeleccionados.map(a => Number(a)) 
        : []
    };

    const response = await apiClient.put(`/peliculas/${id}`, peliculaCorregida);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la película con ID ${id}:`, error);
    throw new Error("No se pudo actualizar la película. Verifica los datos.");
  }
};

export const deletePelicula = async (id) => {
  try {
    await apiClient.delete(`/peliculas/${id}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar la película con ID ${id}:`, error);
    throw new Error("No se pudo eliminar la película. Inténtalo más tarde.");
  }
};

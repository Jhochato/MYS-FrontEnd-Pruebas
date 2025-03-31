import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import ActoresPage from "./pages/ActoresPage";
import DirectoresPage from "./pages/DirectoresPage";
import GenerosPage from "./pages/GenerosPage";
import Paises from "./pages/PaisesPage";
import Peliculas from "./pages/PeliculasPage";
import EditActorForm from "./pages/EditActorForm";
import EditDirectorForm from "./pages/EditDirectorForm";
import EditGeneroForm from "./pages/EditGeneroForm";
import EditPaisForm from "./pages/EditPaisForm";
import EditPeliculaForm from "./pages/EditPeliculaForm";
import CrearPeliculaForm from "./pages/AddPeliculaForm";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        
        <Route path="/actores" element={<ActoresPage />} />
        <Route path="/actores/nuevoactor" element={<EditActorForm />} />
        <Route path="/actores/editaractor/:id" element={<EditActorForm />} />

        <Route path="/generos" element={<GenerosPage />} />
        <Route path="/generos/nuevogenero" element={<EditGeneroForm />} />
        <Route path="/generos/editargenero/:id" element={<EditGeneroForm />} />

        <Route path="/directores" element={<DirectoresPage />} />
        <Route path="/directores/nuevodirector" element={<EditDirectorForm />} />
        <Route path="/directores/editardirector/:id" element={<EditDirectorForm />} />

        <Route path="/paises" element={<Paises />} />
        <Route path="/paises/nuevopais" element={<EditPaisForm />} />
        <Route path="/paises/editarpais/:id" element={<EditPaisForm />} />

        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/peliculas/nuevapelicula" element={<CrearPeliculaForm />} />
        <Route path="/peliculas/editarpelicula/:id" element={<EditPeliculaForm />} />
      </Routes>
    </Router>
  );
}

export default App;

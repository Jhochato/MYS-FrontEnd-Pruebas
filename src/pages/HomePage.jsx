import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

function Home() {
  const [usuario, setUsuario] = useState("Invitado");

  useEffect(() => {
    const nombreUsuario = localStorage.getItem("usuario");

    if (nombreUsuario) {
      setUsuario(nombreUsuario);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="home-container">
        <div className="home-box">
          <h1>Bienvenido a la página de administracion de series animadas, {usuario}!</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;

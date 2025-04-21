import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

// Componente que maneja el modo oscuro
const ButtonTheme = () => {
    // Leer el tema guardado en localStorage o usar el tema del sistema
    const getInitialTheme = () => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) return savedTheme;
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return "light";
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // Función para cambiar el tema
    const changeTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme); // Guardar el tema en localStorage
            return newTheme;
        });
    };

    // Aplicar el tema al cargar el componente
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return (
        <div className="mt-auto w-full flex items-center justify-center mb-4 space-x-4">
            {/* Ícono de Sol */}
            <FaSun className="w-10 h-10 text-yellow-400" />

            {/* Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={changeTheme}
                    className="sr-only peer"
                />
                <div className="w-20 h-9 bg-lightGray peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white rounded-full peer transition-all">
                    {/* Círculo deslizante */}
                    <span
                        className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform flex items-center justify-center ${
                            theme === "dark" ? "translate-x-11" : "translate-x-0"
                        }`}
                    >
                    </span>
                </div>
            </label>

            {/* Ícono de Luna */}
            <FaMoon className={`w-10 h-10  text-white`} />
        </div>
    );
};

export default ButtonTheme;
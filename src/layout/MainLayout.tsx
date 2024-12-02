import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { logout, deleteToken, deleteStore } = useAuthStore();

  const cerrarSesion = () => {
    logout();
    deleteToken();
    deleteStore();
  };

  return (
    <>
      <header className="flex justify-end items-end p-4 gap-4">
        <ModeToggle />
        <Button
          onClick={cerrarSesion}
          className="hover:bg-red-600 hover:text-white"
        >
          {" "}
          Cerrar Sesión
        </Button>
      </header>
      <Outlet />
    </>
  );
};
export default MainLayout;

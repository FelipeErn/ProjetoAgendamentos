import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export const Header = () => {
    return (
        <>
            <Navbar title="Página Inicial" />
            <Sidebar />
        </>
    );
}
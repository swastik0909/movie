import Newbar from "./components/Newbar";
import AllRoutes from "./routes/AllRoutes";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  // 🚫 Hide navbar on login & admin pages
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Newbar />}
      <AllRoutes />
    </>
  );
}

export default App;

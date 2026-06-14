import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import Navbar from "./componentes/Navbar/Navbar";

function App() {
    
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
import {
  BrowserRouter,
  Routes,
  Route
}
from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import ImpactReport from "./pages/ImpactReport";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/workspace/:id"
          element={<Workspace />}
        />

        <Route
          path="/report/:id"
          element={<ImpactReport />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUser } from "./redux/userSlice";
import { Home } from "./pages/Home";
import { Overview } from "./pages/Overview/Overview";
import { Nmap } from "./pages/Nmap/Nmap";
import { Nikto } from "./pages/Nikto/Nikto";
import { WPScan } from "./pages/WPScan/WPScan";
import { Settings } from "./pages/Settings/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedRoutes } from "./layout/ProtectedRoutes";
import { PublicRoutes } from "./layout/PublicRoutes";
import { Loading } from "./components/Loading";

export const App = () => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    dispatch(getLoggedUser()).then(() => setIsInitialized(true));
  }, []);

  if (!isInitialized) {
    return <Loading />
  }



  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/nmap/:scanId?" element={<Nmap />} />
          <Route path="/nikto" element={<Nikto />} />
          <Route path="/wpscan" element={<WPScan />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

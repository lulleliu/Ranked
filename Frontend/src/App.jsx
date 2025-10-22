import CoursePage from "./pages/CoursePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export default function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/courses/:courseCode" element={<CoursePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<LoginPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

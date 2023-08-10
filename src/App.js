import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { MThemeProvider } from "./themeContext/MThemeProvider";
import MainLayout from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { DetailPage } from "./pages/DetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import React from "react";
import { AlertMsg } from "./features/AlertMsg";

function App() {
  return (
    <div className="App">
      <MThemeProvider>
        <BrowserRouter>
          <div>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/pokemons/:id" element={<DetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </div>
          <AlertMsg />
        </BrowserRouter>
      </MThemeProvider>
    </div>
  );
}

export default App;

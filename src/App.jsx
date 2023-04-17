import * as React from "react";
import Box from "@mui/material/Box";
import "./App.css";
import DataTablePage from "./Pages/DataTablePage/DataTablePage";
import EditFormPage from "./Pages/EditFormPage/EditFormPage";
import AddFormPage from "./Pages/AddFormPage/AddFormPage";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <BrowserRouter>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/:table" element={<DataTablePage />} />
          <Route path="/edit/:table/:id" element={<EditFormPage />} />
          <Route path="/add/:table" element={<AddFormPage />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;

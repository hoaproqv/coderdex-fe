import { Outlet } from "react-router-dom";
import { Box, Fab, Stack } from "@mui/material";
import { MainFooter } from "./MainFooter";
import { MainHeader } from "./MainHeader";
import PokemonModal from "../components/PokemonModal";
import React, { useState } from "react";
import EggIcon from "@mui/icons-material/Egg";
import PokemonModalEdit from "../components/PokemonModalEdit";
import { useSelector } from "react-redux";
function MainLayout() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenEdit = () => setOpenEdit(true);
  const { pokemon } = useSelector((state) => state.pokemons.pokemon);
  return (
    <Stack sx={{ minHeight: "100vh" }}>
      <MainHeader />
      <Outlet />
      <Box sx={{ flexGrow: 1 }} />
      <MainFooter />
      <PokemonModal open={open} setOpen={setOpen} />
      <PokemonModalEdit openEdit={openEdit} setOpenEdit={setOpenEdit} />
      <Box
        sx={{
          position: "fixed",
          bottom: "3rem",
          right: "1rem",
          color: "white",
          borderRadius: "50%",
          "& > :not(style)": { m: 1 },
        }}
        onClick={pokemon ? handleOpenEdit : handleOpen}
      >
        <Fab color="primary" aria-label="add">
          <EggIcon className="create-btn" />
        </Fab>
      </Box>
    </Stack>
  );
}

export default MainLayout;

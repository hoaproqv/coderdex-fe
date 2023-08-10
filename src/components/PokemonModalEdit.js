import Box from "@mui/material/Box";
import { FormProvider, FTextField } from "./form";
import Modal from "@mui/material/Modal";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  alpha,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { deletePokemon, editPokemon } from "../features/pokemons/pokemonSlice";
import React, { useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TYPESPKM, style, imageUrl } from "../global/variable";
import { useNavigate } from "react-router-dom";

//Schema
const schema = yup
  .object({
    name: yup.string().required(),
    id: yup.number().positive().integer().required(),
  })
  .required();

export default function PokemonModalEdit({ openEdit, setOpenEdit }) {
  // useSelector
  const pokemon = useSelector((state) => state.pokemons.pokemon.pokemon);
  const { isLoading } = useSelector((state) => state.pokemons);
  //useState
  const [errorStatus, setErrorStatus] = useState(false);
  const [type1, setType1] = useState(pokemon?.type_1);
  const [type2, setType2] = useState(pokemon?.type_2);
  const [selectedFileName, setSelectedFileName] = useState("");

  //useRef
  const fileRef = useRef();

  //useForm, dispatch, navigate
  const methods = useForm({ resolver: yupResolver(schema) });
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //handleFunction
  const handleSetType1 = (event) => {
    setType1(event.target.value);
  };

  const handleSetType2 = (event) => {
    setType2(event.target.value);
  };

  const handleCloseModal = () => setOpenEdit(false);

  const handleDeletePkm = () => {
    dispatch(deletePokemon(pokemon.id));
    navigate("/");
    setOpenEdit(false);
  };

  const handleFileChange = (event) => {
    setSelectedFileName(event.target.files[0].name);
    const file = fileRef.current.files[0];
    if (file) {
      setValue("image", file);
    } else {
      setValue("image", null);
    }
  };

  //other
  function firstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // useEffect
  useEffect(() => {
    if (type1 === type2) {
      setErrorStatus(true);
    } else {
      setErrorStatus(false);
    }
  }, [type1, type2]);

  useEffect(() => {
    setValue("name", pokemon?.pokemon);
    setValue("id", pokemon?.id);
    setValue("height", pokemon?.height);
    setValue("weight", pokemon?.weight);
    setValue("attack", pokemon?.attack);
    setValue("defense", pokemon?.defense);
    setValue("hp", pokemon?.hp);
    setValue("spAtk", pokemon?.special_attack);
    setValue("spDef", pokemon?.special_defense);
    setValue("speed", pokemon?.speed);
    setValue("evolvesId", pokemon?.evolves_from_species_id);
    setValue("generation", pokemon?.generation_id);
    setValue("hiddenAbility", pokemon?.ability_hidden);
    setValue("ability1", pokemon?.ability_1);
    setValue("ability2", pokemon?.ability_2);
    setValue("imgUrl", pokemon?.url_image);
    setType1(pokemon?.type_1);
    setType2(pokemon?.type_2);
  }, [pokemon, setValue]);

  //Submit
  const onSubmit = (data) => {
    const {
      name,
      id,
      image,
      imgUrl,
      height,
      weight,
      attack,
      defense,
      hp,
      spAtk,
      spDef,
      speed,
      evolvesId,
      generation,
      hiddenAbility,
      ability1,
      ability2,
    } = data;
    if (!errors || !type1 || !type2) {
      setOpenEdit(false);
    } else {
      dispatch(
        editPokemon({
          name,
          id: String(id),
          image,
          imgUrl,
          types: [type1, type2],
          height,
          weight,
          attack,
          defense,
          hp,
          spAtk,
          spDef,
          speed,
          evolvesId,
          generation,
          hiddenAbility,
          abilities: [ability1, ability2],
        }),
      );
      setOpenEdit(false);
    }
  };

  return (
    <div>
      <Modal
        open={openEdit}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="name"
                    label="Name"
                    fullWidth
                    rows={4}
                    placeholder="Name"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={4} md={3}>
                  <FTextField
                    name="id"
                    label="ID pokemon"
                    fullWidth
                    placeholder="Id (min: 722)"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={4} md={3}>
                  <FormControl sx={{ minWidth: 195 }} error={!Boolean(type1)}>
                    <InputLabel>Type 1</InputLabel>
                    <Select
                      name="type1"
                      value={type1}
                      label="Type 1"
                      onChange={(event) => handleSetType1(event)}
                      sx={{
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          paddingTop: "15.5px",
                          paddingBottom: "15.5px",
                        },
                      }}
                    >
                      {TYPESPKM.map((type) => (
                        <MenuItem value={type} key={type}>
                          <img
                            src={`${imageUrl}/TypesIcon/${type}.png`}
                            alt="type"
                            width="25px"
                            style={{ display: "inline-block", marginRight: 10 }}
                          />
                          {firstLetter(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4} md={3}>
                  <FormControl
                    sx={{ minWidth: 195 }}
                    error={errorStatus || !Boolean(type2)}
                  >
                    <InputLabel>Type 2</InputLabel>
                    <Select
                      name="type2"
                      value={type2}
                      label="Type 2"
                      onChange={(event) => handleSetType2(event)}
                      sx={{
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          paddingTop: "15.5px",
                          paddingBottom: "15.5px",
                        },
                      }}
                    >
                      <MenuItem value="NA">N/A</MenuItem>
                      {TYPESPKM.map((type) => (
                        <MenuItem value={type} key={type}>
                          <img
                            src={`${imageUrl}/TypesIcon/${type}.png`}
                            alt="type"
                            width="25px"
                            style={{ display: "inline-block", marginRight: 10 }}
                          />
                          {firstLetter(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4} md={3}>
                  <label htmlFor="file-input">
                    <Button
                      variant="contained"
                      component="label"
                      style={{
                        width: 200,
                        height: 55,
                        backgroundColor: "white",
                        color: "grey",
                        display: "flex",
                        justifyContent: "flex-start",
                        boxShadow: "none",
                        border: "1px solid #DBE0E4",
                        textTransform: "none",
                        fontSize: 16,
                      }}
                    >
                      {selectedFileName || "Image Pokemon"}
                      <input
                        id="file-input"
                        type="file"
                        ref={fileRef}
                        hidden
                        onChange={handleFileChange}
                      />
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="ability1"
                    label="Ability 1"
                    fullWidth
                    rows={4}
                    placeholder="Ability 1"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="ability2"
                    label="Ability 2"
                    fullWidth
                    rows={4}
                    placeholder="Ability 2"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="hiddenAbility"
                    label="Hidden Ability"
                    fullWidth
                    rows={4}
                    placeholder="Hidden Ability"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="height"
                    label="Height"
                    fullWidth
                    rows={4}
                    placeholder="Height"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="weight"
                    label="Weight"
                    fullWidth
                    rows={4}
                    placeholder="Weight"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={4} md={3}>
                  <FTextField
                    name="generation"
                    label="Generation"
                    fullWidth
                    rows={4}
                    placeholder="Generation"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="evolvesId"
                    label="Evolves from id"
                    fullWidth
                    rows={4}
                    placeholder="Evolves"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="hp"
                    label="HP"
                    fullWidth
                    rows={4}
                    placeholder="HP"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="attack"
                    label="Attack"
                    fullWidth
                    rows={4}
                    placeholder="Attack"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="defense"
                    label="Defense"
                    fullWidth
                    rows={4}
                    placeholder="Defense"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="spAtk"
                    label="Special Attack"
                    fullWidth
                    rows={4}
                    placeholder="Special Attack"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="spDef"
                    label="Special Defense"
                    fullWidth
                    rows={4}
                    placeholder="Special Defense"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="speed"
                    label="Speed"
                    fullWidth
                    rows={4}
                    placeholder="Speed"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <LoadingButton
                  style={{
                    marginRight: 5,
                    backgroundColor: "red",
                  }}
                  onClick={handleDeletePkm}
                  variant="contained"
                  size="small"
                  loading={isSubmitting || isLoading}
                >
                  Delete Pokemon
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={isSubmitting || isLoading}
                >
                  Update Pokemon
                </LoadingButton>
              </Box>
            </Box>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}

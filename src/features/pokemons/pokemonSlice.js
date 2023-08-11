import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { POKEMONS_PER_PAGE } from "../../app/config";
import { toast } from "react-toastify";
import { cloudinaryUpload } from "../cloundinary";

const pokemonSlice = createSlice({
  name: "pokemons",
  initialState: {
    isLoading: false,
    error: null,
    pokemons: [],
    pokemon: {
      previousPokemon: null,
      pokemon: null,
      nextPokemon: null,
    },
    pokemonEvolves: null,
    search: "",
    type: "",
    page: 1,
    totalPages: 1,
    next: false,
  },
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getPokemonsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.pokemon = {
        previousPokemon: null,
        pokemon: null,
        nextPokemon: null,
      };
      if (state.page === 1) {
        state.pokemons = [];
        state.next = false;
      }
      const { data, page, totalPages } = action.payload;
      state.totalPages = Number(totalPages);
      state.page = Number(page);
      state.pokemons = state.pokemons.concat(data);
    },
    getPokemonByIdSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.pokemon.previousPokemon = action.payload[0];
      state.pokemon.pokemon = action.payload[1];
      state.pokemon.nextPokemon = action.payload[2];
      if (state.pokemon.pokemon["type_2"] !== "NA") {
        state.types = [
          state.pokemon.pokemon["type_1"],
          state.pokemon.pokemon["type_2"],
        ];
      } else {
        state.types = [state.pokemon.pokemon["type_1"]];
      }
    },
    getEvolvesSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.pokemonEvolves = action.payload[1];
    },
    addPokemonSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.pokemons.push(action.payload);
    },
    updatePokemonSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.pokemon.pokemon = action.payload;
    },
    deletePokemonByIdSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    changePage(state, action) {
      if (action.payload) {
        state.page = action.payload;
      } else {
        state.page++;
      }
    },
    searchQuery(state, action) {
      state.search = action.payload;
    },
    typeQuery(state, action) {
      state.type = action.payload;
    },
    setNext(state, action) {
      state.next = action.payload;
    },
  },
});

export const getPokemons =
  ({ page, search, type }) =>
  async (dispatch) => {
    dispatch(pokemonSlice.actions.startLoading());
    try {
      let params = `?page=${page}&limit=${POKEMONS_PER_PAGE}`;
      if (search) params += `&search=${search}`;
      if (type && type !== "none") params += `&type=${type}`;
      const response = await apiService.get(`/pokemons${params}`);
      dispatch(
        pokemonSlice.actions.getPokemonsSuccess({
          data: response.data,
          page: response.page,
          totalPages: response.totalPages,
        }),
      );
    } catch (error) {
      dispatch(pokemonSlice.actions.hasError(error.message));
    }
  };

export const getPokemonById = (id) => async (dispatch) => {
  dispatch(pokemonSlice.actions.startLoading());
  try {
    const response = await apiService.get(`/pokemons/${id}`);
    dispatch(pokemonSlice.actions.getPokemonByIdSuccess(response.data));
  } catch (error) {
    dispatch(pokemonSlice.actions.hasError(error.message));
  }
};

export const getEvolves = (id) => async (dispatch) => {
  dispatch(pokemonSlice.actions.startLoading());
  try {
    const response = await apiService.get(`/pokemons/${id}`);
    dispatch(pokemonSlice.actions.getEvolvesSuccess(response.data));
  } catch (error) {
    dispatch(pokemonSlice.actions.hasError(error.message));
  }
};

export const addPokemon =
  ({
    name,
    id,
    image,
    types,
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
    abilities,
  }) =>
  async (dispatch) => {
    dispatch(pokemonSlice.actions.startLoading());
    try {
      const imageUrl = await cloudinaryUpload(image);
      const body = {
        id: id,
        name: name,
        height: height || "NA",
        weight: weight || "NA",
        type_1: types[0],
        type_2: types[1],
        attack: attack || "NA",
        defense: defense || "NA",
        hp: hp || "NA",
        special_attack: spAtk || "NA",
        special_defense: spDef || "NA",
        speed: speed || "NA",
        ability_1: abilities[0] || "NA",
        ability_2: abilities[1] || "NA",
        ability_hidden: hiddenAbility || "NA",
        generation_id: generation || "NA",
        evolves_from_species_id: evolvesId || "NA",
        url_image: imageUrl,
      };
      const response = await apiService.post(`/pokemons`, body);
      dispatch(pokemonSlice.actions.addPokemonSuccess(response.data));
      toast.success(response.status);
    } catch (error) {
      dispatch(pokemonSlice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const editPokemon =
  ({
    name,
    id,
    image,
    imgUrl,
    types,
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
    abilities,
  }) =>
  async (dispatch) => {
    dispatch(pokemonSlice.actions.startLoading());
    try {
      if (image) {
        var imageUrl = await cloudinaryUpload(image);
      }
      const body = {
        id: id,
        name: name,
        height: height || "NA",
        weight: weight || "NA",
        type_1: types[0],
        type_2: types[1] || "NA",
        attack: attack || "NA",
        defense: defense || "NA",
        hp: hp || "NA",
        special_attack: spAtk || "NA",
        special_defense: spDef || "NA",
        speed: speed || "NA",
        ability_1: abilities[0] || "NA",
        ability_2: abilities[1] || "NA",
        ability_hidden: hiddenAbility || "NA",
        generation_id: generation || "NA",
        evolves_from_species_id: evolvesId || "NA",
        url_image: imageUrl || imgUrl,
      };
      const response = await apiService.put(`/pokemons/${id}`, body);
      dispatch(pokemonSlice.actions.updatePokemonSuccess(response.data));
      toast.success(response.status);
    } catch (error) {
      dispatch(pokemonSlice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const deletePokemon = (id) => async (dispatch) => {
  dispatch(pokemonSlice.actions.startLoading());
  try {
    const response = await apiService.delete(`/pokemons/${id}`);
    dispatch(pokemonSlice.actions.deletePokemonByIdSuccess());
    toast.success(response.status);
  } catch (error) {
    dispatch(pokemonSlice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const { changePage, searchQuery, typeQuery, setNext } =
  pokemonSlice.actions;
export default pokemonSlice.reducer;

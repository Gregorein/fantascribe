import {
  SET_MAP_DIMENSION,

  NUMBER_OF_POINTS,
  CREATE_POINTS,
  RELAX_POINTS,
  DRAW_POINTS,
  ERASE_POINTS,

  CREATE_TERRAIN,
  RESET_TERRAIN,
  ADD_RANDOM_SLOPE_TERRAIN,
  CONE_TERRAIN,
  INVERSE_CONE_TERRAIN,
  ADD_BLOB_TERRAIN,
  NORMALIZE_TERRAIN,
  ROUND_HILLS_TERRAIN,
  RELAX_TERRAIN,
  SEA_MEDIAN_LEVEL_TERRAIN,
  RAISE_TERRAIN,
  LOWER_TERRAIN,

  SAVE_TERRAIN,
  LOAD_TERRAIN,
  ERODE_TERRAIN,
  SMOOTH_TERRAIN,

  ADD_CITY,
  PLACE_CITY,
  REMOVE_CITY,
  RENAME_CITY,
} from "types/maps"
import {Terrain} from "globals"

export const setMapDimension = x => ({
  type: SET_MAP_DIMENSION,
  payload: {
    x,
  },
})

export const changePointsNumber = n => ({
  type: NUMBER_OF_POINTS,
  payload: {
    n,
  },
})
export const generatePoints = pts => ({
  type: CREATE_POINTS,
  payload: {
    pts,
  },
})
export const relaxPoints = pts => ({
  type: RELAX_POINTS,
  payload: {
    pts,
  },
})
export const drawPoint = p => ({
  type: DRAW_POINTS,
  payload: {
    p,
  },
})
export const erasePoint = p => ({
  type: ERASE_POINTS,
  payload: {
    p,
  },
})

export const createTerrain = t => ({
  type: CREATE_TERRAIN,
  payload: {
    t,
  },
})
export const resetTerrain = t => ({
  type: RESET_TERRAIN,
  payload: {
    t: Terrain.zero(t.mesh),
  },
})
export const addSlopeToTerrain = t => ({
  type: ADD_RANDOM_SLOPE_TERRAIN,
  payload: {
    t: Terrain.add(t, Terrain.slope(t.mesh, Terrain.randomVector(4))),
  },
})
export const coneTerrain = t => ({
  type: CONE_TERRAIN,
  payload: {
    t: Terrain.add(t, Terrain.cone(t.mesh, -.5)),
  },
})
export const inverseConeTerrain = t => ({
  type: INVERSE_CONE_TERRAIN,
  payload: {
    t: Terrain.add(t, Terrain.cone(t.mesh, .5)),
  },
})
export const blobTerrain = t => ({
  type: ADD_BLOB_TERRAIN,
  payload: {
    t: Terrain.add(t, Terrain.mountains(t.mesh, 1)),
  },
})
export const normalizeTerrain = t => ({
  type: NORMALIZE_TERRAIN,
  payload: {
    t: Terrain.normalize(t),
  },
})
export const roundTerrain = t => ({
  type: ROUND_HILLS_TERRAIN,
  payload: {
    t: Terrain.peaky(t),
  },
})
export const relaxTerrain = t => ({
  type: RELAX_TERRAIN,
  payload: {
    t: Terrain.relax(t),
  },
})
export const seaMedianLevelTerrain = t => ({
  type: SEA_MEDIAN_LEVEL_TERRAIN,
  payload: {
    t: Terrain.setSeaLevel(t, 0.5),
  },
})
export const raiseTerrain = t => ({
  type: RAISE_TERRAIN,
  payload: {
    t,
  },
})
export const lowerTerrain = t => ({
  type: LOWER_TERRAIN,
  payload: {
    t,
  },
})

export const saveTerrain = () => ({type: SAVE_TERRAIN})
export const loadTerrain = () => ({type: LOAD_TERRAIN})
export const erodeTerrain = t => ({
  type: ERODE_TERRAIN,
  payload: {
    t,
  },
})
export const smoothTerrain = t => ({
  type: SMOOTH_TERRAIN,
  payload: {
    t,
  },
})

export const addCity = () => ({type: ADD_CITY})
export const placeCity = () => ({type: PLACE_CITY})
export const removeCity = () => ({type: REMOVE_CITY})
export const renameCity = () => ({type: RENAME_CITY})

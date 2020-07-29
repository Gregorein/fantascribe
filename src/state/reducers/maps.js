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
import initialState from "models/maps"

import {Terrain} from "globals"

const maps = (state=initialState, action) => {
  switch (action.type) {
    case SET_MAP_DIMENSION: {
      return {
        ...state,
        x: action.payload.x,

        n_pts: 2**7,
        pts: null,
        vxs: null,

        h: null,
        saved_h: null,
        cities: [],
      } 
    }

    case NUMBER_OF_POINTS: {
      return {
        ...state,
        n_pts: action.payload.n,
        pts: null,
        vxs: null,

        h: null,
        saved_h: null,
        cities: [],
      }
    }
    case CREATE_POINTS:
    case RELAX_POINTS: {
      return {
        ...state,
        pts: action.payload.pts,
        vxs: null,

        h: null,
        saved_h: null,
        cities: [],
      }
    }
    case DRAW_POINTS: {
      return {
        ...state,
        pts: [
          ...state.pts,
          action.payload.p,
        ],
        vxs: null,

        h: null,
        saved_h: null,
        cities: [],
      }
    }
    case ERASE_POINTS: {
      // bugs sometimes happen here
      const {p} = action.payload

      const d = (ax, ay, bx, by) => {
        const dx = ax - bx
        const dy = ay - by

        return Math.sqrt(dx**2 + dy**2)
      }

      const dps = state.pts.map((_p, i) => {
        const dp = d(p[0], p[1], _p[0], _p[1])

        return {
          dp,
          i
        }
      })

      const nearest_p = dps.sort((a, b) => (a.dp >= b.dp))[0].i

      return {
        ...state,
        pts: [...state.pts].filter((_, i) => i !== nearest_p),
        vxs: null,

        h: null,
        saved_h: null,
        cities: [],
      }
    }

    case CREATE_TERRAIN:
    case RESET_TERRAIN:
    case ADD_RANDOM_SLOPE_TERRAIN:
    case CONE_TERRAIN:
    case INVERSE_CONE_TERRAIN:
    case ADD_BLOB_TERRAIN:
    case NORMALIZE_TERRAIN:
    case ROUND_HILLS_TERRAIN:
    case RELAX_TERRAIN:
    case SEA_MEDIAN_LEVEL_TERRAIN: {
      return {
        ...state,
        h: action.payload.t,
        saved_h: null,
        cities: [],
      }
    }

    case RAISE_TERRAIN: {
      return {
        ...state,
        h: Terrain.add(state.h, action.payload.t),
        saved_h: null,
        cities: [],
      }
    }
    case LOWER_TERRAIN: {
      return {
        ...state,
        h: Terrain.add(state.h, action.payload.t),
        saved_h: null,
        cities: [],
      }
    }

    case SAVE_TERRAIN: {
      return {
        ...state,
        saved_h: state.h,
        terr: Terrain.getTerritories(state),
        cities: [],
      }
    }
    case LOAD_TERRAIN: {
      return {
        ...state,
        h: state.saved_h,
        saved_h: null,
        cities: [],
      }
    }
    case ERODE_TERRAIN:
    case SMOOTH_TERRAIN: {
      return {
        ...state,
        h: action.payload.t,
        cities: [],
      }
    }

    case ADD_CITY: {
      const _state = {...state}
      
      Terrain.placeCity(_state)
      
      return {
        ...state
      }
    }
    case PLACE_CITY:
    case REMOVE_CITY:
    case RENAME_CITY: {
      return {
        ...state,
      }
    }

    default: {
     return state
    }
  }
}

export default maps
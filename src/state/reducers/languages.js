import {
  REMOVE_LANGUAGE,
  CREATE_LANGUAGE,
  CONFIG_LANGUAGE,
  GENERATE_WORDS,
  REMOVE_WORD,
  REMOVE_WORDS,
  GENERATE_NAMES,
  REMOVE_NAME,
  REMOVE_NAMES,
} from "types/languages"
import initialState from "models/languages"

const languages = (state=initialState, action) => {
  switch (action.type) {
    case REMOVE_LANGUAGE: {
      return {
        // ...state,
        // _init: false,
        // fullWords: [],
        // cityNames: [],
        // landNames: [],
        // names: [],
        ...initialState,
      }
    }

    case CREATE_LANGUAGE: {
      return {
        ...state,
        _init: true,
        ...action.payload.language,
      }
    }
    case CONFIG_LANGUAGE: {
      let value

      if (typeof action.payload.value !== "object" || action.payload.replace) {
        value = action.payload.value 
      } else if (action.payload.value.length) {
         value =[
            ...state[action.payload.key],
            ...action.payload.value,
          ]
      } else {
        value = {
          ...state[action.payload.key],
          ...action.payload.value,
        }
      }

      return {
        ...state,
        [action.payload.key]: value,
      }
    }

    case GENERATE_WORDS: {
      return {
        ...state,
        words: {
          ...state.words,
          ...action.payload.words,
        },
      }
    }
    case REMOVE_WORD: {
      return {
        ...state,
        // words: state.words.filter(w => w !== action.payload.word),
      }
    }
    case REMOVE_WORDS: {
      return {
        ...state,
        words: {}
      }
    }
    case GENERATE_NAMES: {
      return {
        ...state,
        names: {
          ...state.names,
          ...action.payload.names,
        },
      }
    }
    case REMOVE_NAME: {
      return {
        ...state,
        names: state.names.filter(n => n !== action.payload.name),
      }
    }
    case REMOVE_NAMES: {
      return {
        ...state,
        names: []
      }
    }

    default: {
      return state
    }
  }
}

export default languages
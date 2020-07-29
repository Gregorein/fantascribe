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

export const removeLanguage = () => ({
  type: REMOVE_LANGUAGE,
})

export const createLanguage = (language = {}) => ({
  type: CREATE_LANGUAGE,
  payload: {
    language,
  },
})
export const configLanguage = (key, value, replace=false) => ({
  type: CONFIG_LANGUAGE,
  payload: {
    key,
    value,
    replace,
  },
})

export const generateWords = words => ({
  type: GENERATE_WORDS,
  payload: {
    words,
  },
})
export const removeWord = word => ({
  type: REMOVE_WORD,
  payload: {
    word,
  },
})
export const removeWords = () => ({
  type: REMOVE_WORDS,
})

export const generateNames = names => ({
  type: GENERATE_NAMES,
  payload: {
    names,
  },
})
export const removeName = name => ({
  type: REMOVE_NAME,
  payload: {
    name,
  },
})
export const removeNames = () => ({
  type: REMOVE_NAMES,
})
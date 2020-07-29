import {combineReducers} from "redux"

import languages from "reducers/languages"
import maps from "reducers/maps"

export default combineReducers({
  languages,
  maps,
})
import {
  h,
  Component,
} from "preact"
import {Router} from "preact-router"

import {Provider} from "preact-redux"
import {
  createStore,
  applyMiddleware,
} from "redux"
import thunk from "redux-thunk"
import rootReducer from "reducers"

import Navbar from "components/navbar"

import Home from "routes/home"
import Maps from "routes/maps"
import Languages from "routes/languages"

import "styles"

// dev
if (module.hot) require("preact/debug")

// stores
const store = createStore(
  rootReducer,
  applyMiddleware(thunk),
)

// app
export default class App extends Component {
  state = {
    page: undefined,
  }

  handleRoute = e => {
    this.setState({
      currentUrl: e.url,
    })
  }
  handleSidebar = page => {
    this.setState({
      page,
    })
  }

  render({}, {currentUrl, page}) {
    return (
      <div id="app">
        <Provider store={store}>
          <main>
            <Navbar url={currentUrl} />
            <Router onChange={this.handleRoute}>
              <Home path="/" />
              <Maps path="/mapa" />
              <Languages path="/jezyk" />
            </Router>
          </main>
        </Provider>
      </div>
    )
  }
}
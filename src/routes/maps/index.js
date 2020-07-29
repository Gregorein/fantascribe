import {
  h,
  Component,
} from "preact"
import {connect} from "preact-redux"
import _ref from "linkref"

import {
  setMapDimension,

  changePointsNumber,
  generatePoints,
  relaxPoints,
  drawPoint,
  erasePoint,

  createTerrain,
  resetTerrain,
  addSlopeToTerrain,
  coneTerrain,
  inverseConeTerrain,
  blobTerrain,
  normalizeTerrain,
  roundTerrain,
  relaxTerrain,
  seaMedianLevelTerrain,
  raiseTerrain,
  lowerTerrain,

  saveTerrain,
  loadTerrain,
  erodeTerrain,
  smoothTerrain,

  addCity,
  placeCity,
  removeCity,
  renameCity,
} from "actions/maps"

import {Terrain} from "globals"

import View from "components/view"

import cn from "classnames"
import style from "./style"

class Maps extends Component {
  state = {
    view: undefined,
    editPoints: "add",
    editTerrain: "raise",
    editCity: "rename",
    viewCities: "none",
    brushSize: 0.3,
    brushStrength: 0.2,
  }

  componentDidMount() {

    this.refs.mapContainer.addEventListener("click", this.mousePos)
  }
  componentDidUpdate() {

    this.meshDraw()
  }

  meshDraw = () => {
    const {
      map,
      lang,
      createTerrain,
    } = this.props
    const {
      view,
      viewCities,
    } = this.state
    const div = d3.select("div#mapContainer")
    let SVG

    if (this.refs.mapContainer.innerHTML === "") {
      SVG = div.insert("svg", ":first-child")
        .attr("id", "map")
        .attr("width", map.x)
        .attr("height", map.x * map.params.extent.height / map.params.extent.width)
        .attr("viewBox", `-${map.x * map.params.extent.width/2} -${map.x * map.params.extent.height/2} ${map.x * map.params.extent.width} ${map.x * map.params.extent.height}`);
    } else {
      SVG = d3.select("svg#map")
    }

    switch(view) {
      case "settings": {
        SVG.selectAll().remove()

        return
      }

      case "points": {
        SVG.selectAll().remove()

        Terrain.visualizePoints(SVG, map.pts)
        return
      }
      case "terrain": {
        if (!map.h) {
          SVG.selectAll("circle").remove()

          createTerrain(Terrain.zero(Terrain.makeMesh(map.pts)))
        } else {
          SVG.selectAll("path.field").remove()

          Terrain.visualizeVoronoi(SVG, map.h, -1, 1)
          Terrain.drawPaths(SVG, "coast", Terrain.contour(map.h, 0))
        }

        return
      }
      case "erosion": {
        SVG.selectAll().remove()

        // Terrain.visualizeVoronoi(SVG, Terrain.erosionRate(map.h))
        Terrain.visualizeVoronoi(SVG, map.h, -1, 1)
        Terrain.drawPaths(SVG, "coast", Terrain.contour(map.h, 0))
        return
      }
      case "cities": {
        SVG.selectAll().remove()

        if (viewCities === "borders") {
          Terrain.visualizeVoronoi(SVG, Terrain.getTerritories(map))
        } else if (viewCities === "score") {
          const score = Terrain.cityScore(map.h, map.cities);

          Terrain.visualizeVoronoi(SVG, score, d3.max(score) - 0.5);
        }

        const _map = {...map}
        _map.rivers = Terrain.getRivers(map.h, 0.01)
        _map.coasts = Terrain.contour(map.h, 0)
        _map.borders = Terrain.getBorders(map)

        Terrain.drawPaths(SVG, "rivers", _map.rivers)
        Terrain.drawPaths(SVG, "coast", _map.coasts)
        Terrain.drawPaths(SVG, "border", _map.borders)
        Terrain.visualizeSlopes(SVG, _map)
        Terrain.visualizeCities(SVG, _map)
        Terrain.drawLabels(SVG, _map, lang)
        return
      }

      default:
        return
    }
  }
  mousePos = e => {
    const {view} = this.state

    const cw = e.target.clientWidth
    const ch = e.target.clientHeight
    
    const px = (e.offsetX - (cw/2)) / cw
    const py = (e.offsetY - (ch/2)) / ch

    switch(view) {
      case "settings": {
        return
      }

      case "points": {
        this.editPoint(px, py)
        return
      }
      case "terrain": {
        this.editTerrain(px, py)
        return
      }
      case "erosion": {
        return
      }
      case "cities": {
        this.editCity(px, py)
        return
      }

      default:
        return
    }
  }
  editPoints = e => {

    this.setState(s => ({...s, editPoints: e.target.value}))
  }
  editPoint = (px, py) => {
    if (this.state.editPoints === "add") {
      this.props.drawPoint([px, py])
    } else {
      this.props.erasePoint([px, py])
    }
  }
  editTerrains = e => {

    this.setState(s => ({...s, editTerrain: e.target.value}))
  }
  editTerrain = (px, py) => {
    const {
      map
    } = this.props
    const {
      editTerrain,
      brushSize,
      brushStrength,
    } = this.state

    const m = [px, py]
    const mesh = map.h.mesh
    const terrain = Terrain.zero(mesh)

    if (editTerrain === "raise") {
      for (let i = 0; i < mesh.vxs.length; i++) {
        const p = mesh.vxs[i]

        terrain[i] += (Math.pow(Math.exp(-((p[0] - m[0]) * (p[0] - m[0]) + (p[1] - m[1]) * (p[1] - m[1])) / (2 *brushSize *brushSize)), 2) * brushStrength)
      }

      this.props.raiseTerrain(terrain)
    } else {
      for (let i = 0; i < mesh.vxs.length; i++) {
        const p = mesh.vxs[i]

        terrain[i] -= (Math.pow(Math.exp(-((p[0] - m[0]) * (p[0] - m[0]) + (p[1] - m[1]) * (p[1] - m[1])) / (2 *brushSize *brushSize)), 2) * brushStrength)
      }

      this.props.lowerTerrain(terrain)
    }
  }
  editCities = e => {

    this.setState(s => ({...s, editCity: e.target.value}))
  }
  editCity = (px, py) => {
    switch(this.state.editCities) {
      case "add": {
        this.props.placeCity([px, py])
      }

      case "remove": {
        this.props.removeCity([px, py])
      }

      default:
      case "rename": {
        this.props.renameCity([px, py])
      }
    }
  }
  setViewCities = e => {
    this.setState(s => ({...s, viewCities: e.target.value}))
  }

  setView = e => {

    this.setState(s => ({...s, view: e.target.value}))
  }
  renderToolbar = view => {
    switch(view) {
      default:
      case "settings": {
        return this.settingsToolbar()
      }
      case "points": {
        return this.pointsToolbar()
      }
      case "terrain": {
        return this.terrainToolbar()
      }
      case "erosion": {
        return this.erosionToolbar()
      }
      case "cities": {
        return this.citiesToolbar()
      }
    }
  }
  settingsToolbar = () => {
    const {
      map,
      setMapDimension,
    } = this.props

    return (
      <div class={cn(style.row, style.rowCentered)}>
        <label>
          <p>Szerokość i Wysokość (kwadrat)</p>
          <input type="number" value={map.x} min={1} onChange={e => {
            setMapDimension(Number(e.target.value))
            this.refs.mapContainer.innerHTML = ""
          }} />
        </label>
      </div>
    )
  }
  pointsToolbar = () => {
    const {
      map,
      changePointsNumber,
      generatePoints,
      relaxPoints,
    } = this.props
    const {
      editPoints,
    } = this.state

    return (
      <div class={cn(style.row, style.rowCentered)}>
        <label>
          <p>Liczba punktów</p>
          <input type="number" value={map.n_pts} min={16} onChange={e => changePointsNumber(Number(e.target.value))} />
        </label>
        <button onClick={() => generatePoints(Terrain.generatePoints(map.n_pts))}>Generuj nowe punkty</button>
        <button onClick={() => relaxPoints(Terrain.improvePoints(map.pts))}>Rozluźnij punkty</button>

        <label>
          <input type="radio" name="point" value="add" checked={editPoints === "add"} onClick={this.editPoints} />
          <p>dodaj punkt</p>
        </label>
        <label>
          <input type="radio" name="point" value="remove" onClick={this.editPoints} />
          <p>usuń punkt</p>
        </label>
      </div>
    )
  }
  terrainToolbar = () => {
    const {
      map,
      resetTerrain,
      addSlopeToTerrain,
      coneTerrain,
      inverseConeTerrain,
      blobTerrain,
      normalizeTerrain,
      roundTerrain,
      relaxTerrain,
      seaMedianLevelTerrain,
      raiseTerrain,
      lowerTerrain,
    } = this.props
    const {
      editTerrain,
      brushSize,
      brushStrength,
    } = this.state

    return (
      <div>
        <div class={cn(style.row, style.rowCentered)}>
          <button onClick={() => resetTerrain(map.h)}>Resetuj</button>
          <button onClick={() => addSlopeToTerrain(map.h)}>Dodaj skarpę</button>
          <button onClick={() => coneTerrain(map.h)}>Wypiętrz środek mapy</button>
          <button onClick={() => inverseConeTerrain(map.h)}>Wklęśnij środek mapy</button>
          <button onClick={() => blobTerrain(map.h)}>Dodaj wzgórze</button>
          <button onClick={() => normalizeTerrain(map.h)}>Normalizuj</button>
          <button onClick={() => relaxTerrain(map.h)}>Wygładź</button>
          <button onClick={() => seaMedianLevelTerrain(map.h)}>Uśrednij poziom morza</button>
      </div>
      <div class={cn(style.row, style.rowCentered)}>
        <label>
          <input type="radio" name="terrain" value="raise" checked={editTerrain === "raise"} onClick={this.editTerrains} />
          <p>Wypiętrz</p>
        </label>
        <label>
          <input type="radio" name="terrain" value="lower" onClick={this.editTerrains} />
          <p>Wklęsnij</p>
        </label>
        <label>
          <input type="number" style="width:64px" min={0.01} max={0.3} step={0.01} value={brushSize} onChange={e => this.setState(s => ({...s, brushSize: Number(e.target.value)}))} />
          <input type="range" name="brush" min={0.01} max={0.3} step={0.01} value={brushSize} onChange={e => this.setState(s => ({...s, brushSize: Number(e.target.value)}))} />
          <p>Zasięg pędzla</p>
        </label>
        <label>
          <input type="number" style="width:64px" min={0.1} max={1} step={0.05} value={brushStrength} onChange={e => this.setState(s => ({...s, brushStrength: Number(e.target.value)}))} />
          <input type="range" name="brush" min={0.1} max={1} step={0.05} value={brushStrength} onChange={e => this.setState(s => ({...s, brushStrength: Number(e.target.value)}))} />
          <p>Siła pędzla</p>
        </label>
      </div>
    </div>
    )
  }
  erosionToolbar = () => {
    const {
      map,
      saveTerrain,
      loadTerrain,
      seaMedianLevelTerrain,
      erodeTerrain,
      smoothTerrain,
    } = this.props

    return (
      <div class={cn(style.row, style.rowCentered)}>
        <label>
          <button onClick={saveTerrain}>Zapisz teren</button>
          <button onClick={loadTerrain}>Przywróć teren</button>
          <button onClick={() => seaMedianLevelTerrain(map.h)}>Uśrednij poziom morza</button>
          <button onClick={() => erodeTerrain(Terrain.doErosion(map.h, 0.1))}>Eroduj teren</button>
          <button onClick={() => smoothTerrain(Terrain.fillSinks(Terrain.cleanCoast(map.h, 1)))}>Oczyść wybrzeża</button>
        </label>
      </div>
    )
  }
  citiesToolbar = () => {
    const {
      map,
      addCity,
    } = this.props
    const {
      editCity,
      viewCities,
    } = this.state

    return (
      <div class={cn(style.row, style.rowCentered)}>
        <label>
          <input type="radio" name="cityView" value="none" checked={viewCities === "none"} onClick={this.setViewCities} />
          <p>Mapa</p>
        </label>
        <label>
          <input type="radio" name="cityView" value="borders" onClick={this.setViewCities} />
          <p>Terytoria</p>
        </label>
        <label>
          <input type="radio" name="cityView" value="score" onClick={this.setViewCities} />
          <p>Szansa na miasto</p>
        </label>

        <button onClick={addCity}>Dodaj miasto</button>

        <label>
          <input type="radio" name="city" value="rename" checked={editCity === "rename"} onClick={this.editCities} />
          <p>zmień nazwę miasta</p>
        </label>
        <label>
          <input type="radio" name="city" value="place" onClick={this.editCities} />
          <p>dodaj miasto</p>
        </label>
        <label>
          <input type="radio" name="city" value="remove" onClick={this.editCities} />
          <p>usuń miasto</p>
        </label>
      </div>
    )
  }

  render({map}, {view, editPoints, editTerrain}) {
    return (
      <View
        title="Mapa"
        class={style.view}>
        <div class={cn(style.navbar)}>
          <div class={cn(style.row, style.rowCentered)}>
            <label>
              <input type="radio" name="state" value="settings" checked={!view} onClick={this.setView} />
              <p>Ustawienia mapy</p>
            </label>
            <label>
              <input type="radio" name="state" value="points" onClick={this.setView} />
              <p>Dodawanie punktów</p>
            </label>
            <label>
              <input type="radio" name="state" value="terrain" onClick={this.setView} />
              <p>Rysowanie terenu</p>
            </label>
            <label>
              <input type="radio" name="state" value="erosion" onClick={this.setView} />
              <p>Erozja</p>
            </label>
            <label>
              <input type="radio" name="state" value="cities" onClick={this.setView} />
              <p>Dodawanie miast</p>
            </label>
          </div>
          <div class={cn(style.row, style.rowCentered)}>
            {this.renderToolbar(view)}
          </div>
        </div>
        <div class={cn(style.container)}>
          <div class={cn(style.map, {
            [style.addPoints]: view === "points" && editPoints === "add",
            [style.removePoints]: view === "points" && editPoints === "remove",
            [style.addPoints]: view === "terrain" && editTerrain === "raise",
            [style.removePoints]: view === "terrain" && editTerrain === "lower",
          })} style={`width: ${map.x}px; height: ${map.x}px`} id="mapContainer" ref={_ref(this, "mapContainer")} />
        </div>
      </View>
    )
  }
}

const stateProps = (state, props) => ({
  lang: state.languages,
  map: state.maps,
})
const dispatchProps = (dispatch, props) => ({
  setMapDimension: x => dispatch(setMapDimension(x)),

  changePointsNumber: n => dispatch(changePointsNumber(n)),
  generatePoints: pts => dispatch(generatePoints(pts)),
  relaxPoints: pts => dispatch(relaxPoints(pts)),
  drawPoint: p => dispatch(drawPoint(p)),
  erasePoint: p => dispatch(erasePoint(p)),

  createTerrain: t => dispatch(createTerrain(t)),
  resetTerrain: t => dispatch(resetTerrain(t)),
  addSlopeToTerrain: t => dispatch(addSlopeToTerrain(t)),
  coneTerrain: t => dispatch(coneTerrain(t)),
  inverseConeTerrain: t => dispatch(inverseConeTerrain(t)),
  blobTerrain: t => dispatch(blobTerrain(t)),
  normalizeTerrain: t => dispatch(normalizeTerrain(t)),
  roundTerrain: t => dispatch(roundTerrain(t)),
  relaxTerrain: t => dispatch(relaxTerrain(t)),
  seaMedianLevelTerrain: t => dispatch(seaMedianLevelTerrain(t)),
  raiseTerrain: (p, brushSize, brushStrength) => dispatch(raiseTerrain(p, brushSize, brushStrength)),
  lowerTerrain: (p, brushSize, brushStrength) => dispatch(lowerTerrain(p, brushSize, brushStrength)),

  saveTerrain: () => dispatch(saveTerrain()),
  loadTerrain: () => dispatch(loadTerrain()),
  erodeTerrain: t => dispatch(erodeTerrain(t)),
  smoothTerrain: t => dispatch(smoothTerrain(t)),

  addCity: () => dispatch(addCity()),
  placeCity: p => dispatch(placeCity(p)),
  removeCity: p => dispatch(removeCity(p)),
  renameCity: p => dispatch(renameCity(p)),
})

export default connect(stateProps, dispatchProps)(Maps)
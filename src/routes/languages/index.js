import {
  h,
  Component,
} from "preact"
import {connect} from "preact-redux"

import {
  removeLanguage,
  createLanguage,
  configLanguage,
} from "actions/languages"

import {Language} from "globals"

import View from "components/view"

import cn from "classnames"
import style from "./style"

class Languages extends Component {
  pickSyllable = e => {
    if (e.target.value !== "random") {
      const i = Number(e.target.value)
      
      const minsyll = Math.floor(i / 4) + 1;
      const maxsyll = minsyll + (i % 4);

      this.props.configLanguage("minsyll", minsyll)
      this.props.configLanguage("maxsyll", maxsyll)
    } else {
      const is = [Math.floor(Math.random() * 20)+1, Math.floor(Math.random() * 20)+1].sort((a,b) => a > b)

      this.props.configLanguage("minsyll", is[0])
      this.props.configLanguage("maxsyll", is[1])  
    }
  }
  createLanguage = () => {
    const {
      createLanguage,
      configLanguage,
      language,
    } = this.props
    createLanguage()

    configLanguage("fullWords", new Array(10).fill("word").map(_ => Language.makeWord(language, "word")))
    configLanguage("cityNames", new Array(10).fill("City").map(_ => Language.makeName(language, "city")))
    configLanguage("landNames", new Array(10).fill("Land").map(_ => Language.makeName(language, "land")))
  }

  render({language, removeLanguage, configLanguage}) {
    return (
      <View
        title="Język"
        class={cn(style.view)}>
        <div class={cn(style.navbar)}>
          {(
            language.minsyll !== -1 && 
            language.maxsyll !== -1 &&
            language.phonemes.V && Object.keys(language.phonemes.V).length !== 0 &&
            language.phonemes.C && Object.keys(language.phonemes.C).length !== 0 &&
            language.phonemes.S && Object.keys(language.phonemes.S).length !== 0 &&
            language.phonemes.L && Object.keys(language.phonemes.L).length !== 0 &&
            language.phonemes.F && Object.keys(language.phonemes.F).length !== 0 &&
            true
          ) && (
             <button onClick={this.createLanguage} class={cn(style.button)}>generuj język</button>
          )}
          {language._init && (
            <button onClick={removeLanguage} class={cn(style.button)}>zresetuj język</button>
          )}
        </div>
        <div class={cn(style.container)}>
          <div class={cn(style.column)}>
            <div class={cn(style.row)}>
              <label>
                <p>Sylaby w słowie</p> 
                <select onChange={this.pickSyllable}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">1</option>
                  <option value="1">1-2</option>
                  <option value="2">1-3</option>
                  <option value="3">1-4</option>
                  <option value="4">2</option>
                  <option value="5">2-3</option>
                  <option value="6">2-4</option>
                  <option value="7">2-5</option>
                  <option value="random">Losowo</option>
                </select>
              </label>
              <label>
                <p>Struktura sylab</p> 
                <select onChange={e => configLanguage("structure", Language.syllstructs[Number(e.target.value)], true)}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">CVC</option>
                  <option value="1">CVV?C</option>
                  <option value="2">CVVC?</option>
                  <option value="3">CVC?</option>
                  <option value="4">CV</option>
                  <option value="5">VC</option>
                  <option value="6">CVF</option>
                  <option value="7">C?VC</option>
                  <option value="8">CVF?</option>
                  <option value="9">CL?VC</option>
                  <option value="10">CL?VF</option>
                  <option value="11">S?CVC</option>
                  <option value="12">S?CVF</option>
                  <option value="13">S?CVC?</option>
                  <option value="14">C?VF</option>
                  <option value="15">C?VC?</option>
                  <option value="16">C?VF?</option>
                  <option value="17">C?L?VC</option>
                  <option value="18">VC</option>
                  <option value="19">CVL?C?</option>
                  <option value="20">C?VL?C</option>
                  <option value="21">C?VLC?</option>
                  <option value="random">Losowo</option>
                </select>
                <p>C,V – podstawowe morfemy.<br/>S,L,F – specjalne morfemy.</p>
              </label>
            </div>
            <div class={cn(style.row)}>
              <label>
                <p>Rodzaj samogłosek</p> 
                <select onChange={e => configLanguage("vortho", Language.vorthsets[Number(e.target.value)].orth, true)}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">Ákcentowane</option>
                  <option value="1">Ümlauty</option>
                  <option value="2">Walijskie</option>
                  <option value="3">Dyftongi</option>
                  <option value="4">Podwójne</option>
                </select>
              </label>
              <label>
                <p>Zestaw samogłosek</p> 
                <select onChange={e => configLanguage("phonemes", {V: (Language.vowsets[Number(e.target.value)].V).split("")})}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">Podstawowe 5 samogłosek</option>
                  <option value="1">Wyłącznie (a i u)</option>
                  <option value="2">Dodatkowe (A E I)</option>
                  <option value="3">Dodatkowe (U)</option>
                  <option value="4">5 samogłoski (a i u A I)</option>
                  <option value="5">3 samogłoski (e o u)</option>
                  <option value="6">Extra (A O U)</option>
                </select>
                <p>a,e,i,o,u,y - podstawowe samogłoski.<br/>A,E,I,O,U,Y – specjalne samogłoski, umlauty itd.</p>
              </label>
            </div>
            <div class={cn(style.row)}>
              <label>
                <p>Rodzaj spółgłosek</p> 
                <select onChange={e => configLanguage("cortho", Language.corthsets[Number(e.target.value)].orth, true)}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">Łaciński</option>
                  <option value="1">Słowiański</option>
                  <option value="2">Germański</option>
                  <option value="3">Francuski</option>
                  <option value="4">Chiński (pinyin)</option>
                </select>
              </label>
              <label>
                <p>Zestaw spółgłosek</p> 
                <select onChange={e => configLanguage("phonemes", {C: (Language.consets[Number(e.target.value)].C).split("")})}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">Minimalne</option>
                  <option value="1">Angielskie</option>
                  <option value="7">Angielskie (bardzo proste)</option>
                  <option value="2">Pirahã (bardzo proste)</option>
                  <option value="3">Hawajskie</option>
                  <option value="4">Grenlandzkie</option>
                  <option value="5">Arabskie</option>
                  <option value="6">Arabiskie (bardzo proste)</option>
                </select>
              </label>
            </div>
            <div class={cn(style.row)}>
              <label>
                <p>Ograniczenia</p> 
                <select onChange={e => configLanguage("restricts", Language.ressets[Number(e.target.value)].res, true)}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">Brak</option>
                  <option value="1">Podwójne dźwięki</option>
                  <option value="2">Podwójne dźwięki and twarde klastry</option>
                </select>
              </label>
            </div>
            <div class={cn(style.row)}>
              <label>
                <p>Spółgłoski szczelinowe</p> 
                <select onChange={e => configLanguage("phonemes", {S: (Language.ssets[Number(e.target.value)].S).split("")})}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">Wyłącznie (s)</option>
                  <option value="1">(s ʃ)</option>
                  <option value="2">(s ʃ f)</option>
                </select>
              </label>

              <label>
                <p>Spółgłoski płynne</p> 
                <select onChange={e => configLanguage("phonemes", {L: (Language.lsets[Number(e.target.value)].L).split("")})}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">(r l)</option>
                  <option value="1">Wyłącznie (r)</option>
                  <option value="2">Wyłącznie (l)</option>
                  <option value="3">(w j)</option>
                  <option value="4">(r l w j)</option>
                </select>
              </label>

              <label>
                <p>Spółgłoski kończące</p> 
                <select onChange={e => configLanguage("phonemes", {F: (Language.fsets[Number(e.target.value)].F).split("")})}>
                  <option selected disabled>Wybierz</option>
                  <option value="0">(m n)</option>
                  <option value="1">(s k)</option>
                  <option value="2">(m n ŋ)</option>
                  <option value="3">(s ʃ z ʒ)</option>
                </select>
              </label>
            </div>
          </div>
          <div class={cn(style.column)}>
            <div class={cn(style.row)}><h2>słowa:</h2>   
              {[...language.fullWords].map(w => (<p>{w}</p>))}
            </div>
            <div class={cn(style.row)}><h2>miasta:</h2>   
              {[...language.cityNames].map(w => (<p>{w}</p>))}
            </div>
            <div class={cn(style.row)}><h2>krainy:</h2>   
              {[...language.landNames].map(w => (<p>{w}</p>))}
            </div>
          </div>
        </div>
      </View>
    )
  }
}

const stateProps = (state, props) => ({
  language: state.languages,
})
const dispatchProps = (dispatch, props) => ({
  removeLanguage: () => dispatch(removeLanguage()),
  createLanguage: (language = {}) => dispatch(createLanguage(language)),
  configLanguage: (key, value, replace=false) => dispatch(configLanguage(key, value, replace)),
})

export default connect(stateProps, dispatchProps)(Languages)
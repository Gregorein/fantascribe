import {
  h,
  Component,
} from "preact"

import View from "components/view"

import Maps from "icons/maps"
import Pen from "icons/pen"


import cn from "classnames"
import style from "./style"

const Home = () => (
  <View
    title="menu główne"
    class={cn(style.view)}>
    <a class={cn(style.link)} href="/jezyk">
      <Pen scale={4} class={cn(style.icon)} />
      <p class={cn(style.title)}>Język</p>
    </a>
    <a class={cn(style.link)} href="/mapa">
      <Maps scale={4} class={cn(style.icon)} />
      <p class={cn(style.title)}>Mapa</p>
    </a>
  </View>
)

export default Home
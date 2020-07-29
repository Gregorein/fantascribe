import {
  h,
  Component,
} from "preact"
import {Link} from "preact-router/match"

import Radiv from "components/radiv"

import cn from "classnames"
import style from "./style"

export default class Navbar extends Component {
  render({url="/"}) {
    return (
      <Radiv
        class={cn(style.navbar)}
        urls={{}}
        >
        <a
          class={cn(style.link)}
          href="/"
          title="menu"
          >
          menu
        </a>
      </Radiv>
    )
  }
}
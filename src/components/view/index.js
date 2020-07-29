import {
  h,
  Component,
} from "preact"

import Radiv from "components/radiv"

import cn from "classnames"
import style from "./style"

class View extends Component {
  render({children, title="", ...props}) {
    document.title = title

    return (
      <Radiv
        {...props}
        class={style.container}
        urls={{}}
      >
        <div class={cn(style.view, ...props.class)}>
          {children}
        </div>
      </Radiv>
    )
  }
}

export default View
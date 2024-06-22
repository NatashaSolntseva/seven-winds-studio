import { NavItem } from "../../shared/components/NavItem/NavItem";
import { navItems } from "../../utils/text/nav";

import arrowIcon from "../../assets/icons/icon(4).svg";

import style from "./Nav.module.sass";

export function Nav() {
  return (
    <aside className={style.nav}>
      <div className={style.choiceWrapper}>
        <div className={style.textWrapper}>
          <p className={style.title}>Название проекта</p>
          <span className={style.subtitle}>Аббревиатура</span>
        </div>
        <img className={style.listIcon} src={arrowIcon} alt="стрелка" />
      </div>
      <nav>
        <ul className={style.list}>
          {navItems.map((item, index) => (
            <NavItem key={index} label={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

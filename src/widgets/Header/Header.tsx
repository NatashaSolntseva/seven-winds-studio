import { HeaderNav } from "../../entities/HeaderNav/HeaderNav";

import menuIcon from "../../assets/icons/menu.svg";
import backIcon from "../../assets/icons/back.svg";

import style from "./Header.module.sass";

export function Header() {
  return (
    <header className={style.header}>
      <div className={style.iconsWrapper}>
        <img className={style.headerIcon} src={menuIcon} alt="меню" />
        <img className={style.headerIcon} src={backIcon} alt="назад" />
      </div>
      <HeaderNav />
    </header>
  );
}

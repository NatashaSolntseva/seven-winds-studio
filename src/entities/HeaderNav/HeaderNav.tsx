import style from "./HeaderNav.module.sass";

export function HeaderNav() {
  return (
    <nav>
      <ul className={style.navList}>
        <li className={`${style.navItem} ${style.active}`}>
          <a className={style.navLink} href="#">
            Просмотр
          </a>
        </li>
        <li className={style.navItem}>
          <a className={style.navLink} href="#">
            Управление
          </a>
        </li>
      </ul>
    </nav>
  );
}

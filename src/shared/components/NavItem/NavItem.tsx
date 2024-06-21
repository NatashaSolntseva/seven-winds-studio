import listIcon from "../../../assets/icons/icon.svg";

import style from "./NavItem.module.sass";

type NavItemProps = {
  label: string;
};

export function NavItem({ label }: NavItemProps) {
  const isActive = label === "СМР";
  return (
    <li className={`${style.listItem} ${isActive ? style.active : ""}`}>
      <img className={style.listIcon} src={listIcon} alt="список" />
      <p className={style.listText}>{label}</p>
    </li>
  );
}

import { Btn } from "../../shared/components/Btn/Btn";
import style from "./PageTitle.module.sass";

export function PageTitle() {
  return (
    <div className={style.contentWrapper}>
      <div className={style.titleWrapper}>
        <h2 className={style.titleText}>Строительно-монтажные работы</h2>
      </div>
      <div className={style.btnWrapper}>
        <Btn />
      </div>
    </div>
  );
}

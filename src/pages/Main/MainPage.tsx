import { Nav } from "../../entities/Nav/Nav";
import { Header } from "../../widgets/Header/Header";
import { PageContent } from "../../widgets/PageContent/PageContent";

import style from "./Main.module.sass";

export function MainPage() {
  return (
    <div className={style.main}>
      <Header />
      <div className={style.container}>
        <Nav />
        <PageContent />
      </div>
    </div>
  );
}

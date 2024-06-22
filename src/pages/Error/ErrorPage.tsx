import { useRouteError } from "react-router-dom";

import { Nav } from "../../entities/Nav/Nav";
import { Header } from "../../widgets/Header/Header";

import style from "./Error.module.sass";

export function ErrorPage() {
  const error = useRouteError();
  const errorMessage =
    typeof error === "string" || error instanceof Error
      ? error.toString()
      : "An unexpected error occurred";

  return (
    <div className={style.main}>
      <Header />
      <div className={style.container}>
        <Nav />
        <section>
          <p className={style.messageText}>Что-то пошло не так</p>
          <p className={style.messageText}>{errorMessage}</p>
        </section>
      </div>
    </div>
  );
}

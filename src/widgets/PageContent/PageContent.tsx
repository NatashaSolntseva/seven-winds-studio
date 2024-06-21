import { PageTitle } from "../../entities/PageTitle/PageTitle";
import { Table } from "../Table/Table";

import style from "./PageContent.module.sass";

export function PageContent() {
  return (
    <section className={style.container}>
      <PageTitle />
      <Table />
    </section>
  );
}

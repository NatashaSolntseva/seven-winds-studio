import { createBrowserRouter } from "react-router-dom";
import App from "../ui/App";
import { MainPage } from "../../pages/Main/MainPage";
import { ErrorPage } from "../../pages/Error/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/*",
        element: <ErrorPage />,
      },
    ],
  },
]);

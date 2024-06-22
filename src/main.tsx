import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router, store } from "./app";
import "./app/styles/index.sass";
import { Provider } from "react-redux";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
} else {
  throw new Error(
    `Root element with ID 'root' was not found in the document.
    Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.`
  );
}

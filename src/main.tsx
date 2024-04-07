import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./utils/dayjsInit";
import "antd/dist/reset.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import { App, ConfigProvider } from "antd";
import NiceModal from "@ebay/nice-modal-react";

let Timer = lazy(() => import("@/pages/Timer"));
let Layout = lazy(() => import("@/pages/Layout"));

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Timer />,
      },
      {
        path: "/settings",
        element: (
          <div className="flex flex-col justify-center items-center h-full">
            <h1>版本号: </h1>
            <h1>{process.env.m_version}</h1>
          </div>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App>
        <NiceModal.Provider>
          <RouterProvider router={router} />
        </NiceModal.Provider>
      </App>
    </ConfigProvider>
  </React.StrictMode>
);

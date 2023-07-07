import "./index.css";
import "dayjs/locale/fa";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import Contexts from "./kit/contexts";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Employees from "./pages/Employees";
import Attendances from "./pages/Attendances";
import locale from "antd/locale/fa_IR";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import jalaliday from "jalaliday";
import Settings from "./pages/Settings";

dayjs.extend(jalaliday);
dayjs.extend(weekday);

dayjs.locale("fa");
dayjs.calendar("jalali");

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Employees /> },
      { path: "/attendances", element: <Attendances /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
];

const router =
  process.env.REACT_APP_TYPE === "electron"
    ? createHashRouter(routes)
    : createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider
    theme={{
      token: { fontFamily: "IRANSans" },
      components: { Layout: { colorBgHeader: "#2196F3" } },
    }}
    direction="rtl"
    locale={locale}
  >
    <Contexts>
      <RouterProvider router={router} />
    </Contexts>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

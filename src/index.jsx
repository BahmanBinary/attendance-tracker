import "./index.css";
import "dayjs/locale/fa";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import Contexts from "./kit/contexts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Employees from "./pages/Employees";
import Attendances from "./pages/Attendances";
import locale from "antd/locale/fa_IR";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

dayjs.locale("fa");
dayjs.calendar("jalali");

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Employees /> },
      { path: "/attendances", element: <Attendances /> },
    ],
  },
]);

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

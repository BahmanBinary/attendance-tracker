import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import Contexts from "./kit/contexts";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider
    theme={{
      token: { fontFamily: "IRANSans" },
      components: { Layout: { colorBgHeader: "#2196F3" } },
    }}
    direction="rtl"
  >
    <Contexts>
      <App />
    </Contexts>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
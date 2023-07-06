import { Layout, Menu } from "antd";
import { useContext, useEffect } from "react";
import DataBaseContext from "./kit/contexts/DataBase/DataBaseContext";
import { dbState, selectSetting } from "./kit/helpers/database";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaUsers, FaUserCheck } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";

const { Sider, Header, Content, Footer } = Layout;

const menuIconSize = 22;

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    actions: { setDB },
  } = useContext(DataBaseContext);

  useEffect(() => {
    const db = openDatabase("kara", "1.0", "Kara DB", 2 * 1024 * 1024);

    db.transaction(
      function (tx) {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS employees (first_name varchar(255), last_name varchar(255), rank varchar(255), service_location varchar(255))"
        );

        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS attendances (entrance datetime, exit datetime, leave int, leave_type varchar(255), leave_hours int, employee_id int, created_at datetime, FOREIGN KEY (employee_id) REFERENCES employees (rowid))"
        );

        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS settings (option varchar(255), value varchar(255))"
        );

        selectSetting().then((settings) => {
          if (!settings.length)
            db.transaction(
              function (tx) {
                const defaultSettings = {
                  working_hours: [
                    [96, 192],
                    [96, 192],
                    [96, 192],
                    [96, 192],
                    [96, 192],
                    [96, 192],
                  ],
                  holidays: [],
                };

                for (const setting of Object.entries(defaultSettings))
                  tx.executeSql(
                    `INSERT INTO settings (option,value) VALUES ("${
                      setting[0]
                    }",'${JSON.stringify(setting[1])}')`
                  );
              },
              function (error) {
                console.log(error.message);
              }
            );
        });
      },
      function (error) {
        console.log(error.message);
      }
    );

    setDB(db);
    dbState.db = db;
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{ backgroundColor: "#e3f2fd" }}
        collapsible
        defaultCollapsed
      >
        <h1 style={{ textAlign: "center", fontSize: "1.5em" }}>کارا</h1>
        <Menu
          style={{ backgroundColor: "transparent" }}
          items={[
            {
              key: "/",
              icon: (
                <FaUsers
                  style={{ verticalAlign: "middle" }}
                  size={menuIconSize}
                />
              ),
              label: "کارمندان",
              onClick() {
                navigate("/");
              },
            },
            {
              key: "/attendances",
              icon: (
                <FaUserCheck
                  style={{ verticalAlign: "middle" }}
                  size={menuIconSize}
                />
              ),
              label: "حضور غیاب",
              onClick() {
                navigate("/attendances");
              },
            },
            {
              key: "/settings",
              icon: (
                <AiFillSetting
                  style={{ verticalAlign: "middle" }}
                  size={menuIconSize}
                />
              ),
              label: "تنظیمات",
              onClick() {
                navigate("/settings");
              },
            },
          ]}
          selectedKeys={location.pathname}
        />
      </Sider>
      <Layout>
        <Header style={{ color: "white" }}>
          <h2 style={{ height: "fit-content", lineHeight: "normal" }}>
            {((pathname) => {
              switch (pathname) {
                case "/settings":
                  return "تنظیمات";
                case "/attendances":
                  return "حضور غیاب";
                default:
                  return "کارمندان";
              }
            })(location.pathname)}
          </h2>
        </Header>
        <Content style={{ padding: "25px 50px" }}>
          <Outlet />
        </Content>
        <Footer
          style={{
            backgroundColor: "#1045a1",
            color: "white",
            padding: "10px 50px",
            textAlign: "center",
          }}
        >
          خلق شده توسط{" "}
          <a href="https://github.com/Muhammad-Javad" target="_blank">
            محمد جواد
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;

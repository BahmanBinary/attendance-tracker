import { Layout } from "antd";
import { useContext, useEffect } from "react";
import DataBaseContext from "./kit/contexts/DataBase/DataBaseContext";
import { dbState } from "./kit/helpers/database";
import { Outlet } from "react-router-dom";

const { Sider, Header, Content, Footer } = Layout;

function App() {
  const {
    actions: { setDB },
  } = useContext(DataBaseContext);

  useEffect(() => {
    const db = openDatabase("kara", "1.0", "Kara DB", 2 * 1024 * 1024);

    db.transaction(function (tx) {
      // id int not null primary key,
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS employees (first_name varchar(255), last_name varchar(255), rank varchar(255), service_location varchar(255))"
      );
    });

    setDB(db);
    dbState.db = db;
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Sider style={{ backgroundColor: "#e3f2fd" }}>Sider</Sider> */}
      <Layout>
        <Header style={{ color: "white" }}>
          <h2 style={{ height: "fit-content", lineHeight: "normal" }}>کارا</h2>
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

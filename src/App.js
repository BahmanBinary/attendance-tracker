import { FloatButton, Layout } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillPersonCheckFill, BsFillPersonPlusFill } from "react-icons/bs";

const { Sider, Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Sider style={{ backgroundColor: "#e3f2fd" }}>Sider</Sider> */}
      <Layout>
        <Header style={{ color: "white" }}>کارا</Header>
        <Content style={{ padding: "25px 50px" }}>
          <FloatButton.Group
            icon={<AiOutlinePlus style={{ verticalAlign: "middle" }} />}
            trigger="hover"
            type="primary"
          >
            <FloatButton icon={<BsFillPersonPlusFill />} />
            <FloatButton icon={<BsFillPersonCheckFill />} />
          </FloatButton.Group>
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

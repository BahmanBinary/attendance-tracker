import {
  Button,
  Empty,
  FloatButton,
  Layout,
  Modal,
  Popconfirm,
  Table,
} from "antd";
import { AiOutlinePlus, AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BsFillPersonCheckFill, BsFillPersonPlusFill } from "react-icons/bs";
import { MdDangerous } from "react-icons/md";
import CreateEmployee from "./forms/Employee/Create";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import DataBaseContext from "./kit/contexts/DataBase/DataBaseContext";
import {
  dbState,
  deleteEmployee,
  selectEmployee,
} from "./kit/helpers/database";
import UpdateEmployee from "./forms/Employee/Update";

const { Sider, Header, Content, Footer } = Layout;

function App() {
  const {
    actions: { setDB },
  } = useContext(DataBaseContext);

  const [state, setState] = useState({
    employeeCreateModal: false,
    employeeUpdateModal: false,
    employee: null,
    employees: [],
  });

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

    loadEmployees();
  }, []);

  const loadEmployees = useCallback(() => {
    selectEmployee().then((result) =>
      setState((currentState) => {
        currentState.employees = result;

        currentState.employees = currentState.employees.map((item, index) => {
          item.row = index + 1;
          item.key = item.rowid;

          return item;
        });

        return { ...currentState };
      })
    );
  }, []);

  const closeModal = useCallback((modalName) => {
    setState((currentState) => {
      currentState[modalName + "Modal"] = false;

      return { ...currentState };
    });
  }, []);

  const columns = useMemo(
    () => [
      { title: "ردیف", dataIndex: "row", key: "row" },
      { title: "نام", dataIndex: "first_name", key: "firstName" },
      {
        title: "نام خانوادگی",
        dataIndex: "last_name",
        key: "lastName",
      },
      { title: "درجه", dataIndex: "rank", key: "rank" },
      {
        title: "محل خدمت",
        dataIndex: "service_location",
        key: "serviceLocation",
      },
      {
        title: " ",
        key: "actions",
        render: (value, record, index) => {
          const iconSize = 18;

          return (
            <div style={{ direction: "ltr" }}>
              <Popconfirm
                title="حذف کارمند"
                description="آیا از حذف این کارمند اطمینان دارید؟"
                onConfirm={() => {
                  deleteEmployee({ rowid: record.rowid });
                  loadEmployees();
                }}
                okText="بله"
                cancelText="خیر"
                okButtonProps={{ danger: true }}
                icon={
                  <MdDangerous
                    color="red"
                    style={{ verticalAlign: "middle" }}
                  />
                }
              >
                <Button
                  type="text"
                  icon={
                    <AiFillDelete
                      style={{ verticalAlign: "middle" }}
                      size={iconSize}
                    />
                  }
                  shape="circle"
                  className="delete-button"
                />
              </Popconfirm>
              <Button
                type="text"
                icon={
                  <AiFillEdit
                    style={{ verticalAlign: "middle" }}
                    size={iconSize}
                  />
                }
                shape="circle"
                onClick={() => {
                  setState((currentState) => {
                    currentState.employee = record;
                    currentState.employeeUpdateModal = true;

                    return { ...currentState };
                  });
                }}
                className="edit-button"
              />
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Sider style={{ backgroundColor: "#e3f2fd" }}>Sider</Sider> */}
      <Layout>
        <Header style={{ color: "white" }}>
          <h2 style={{ height: "fit-content", lineHeight: "normal" }}>کارا</h2>
        </Header>
        <Content style={{ padding: "25px 50px" }}>
          <Table
            columns={columns}
            dataSource={state.employees}
            locale={{ emptyText: <Empty description="داده ای موجود نیست!" /> }}
          />
          <FloatButton.Group
            icon={<AiOutlinePlus style={{ verticalAlign: "middle" }} />}
            trigger="hover"
            type="primary"
          >
            <FloatButton
              icon={
                <BsFillPersonPlusFill style={{ verticalAlign: "middle" }} />
              }
              onClick={() =>
                setState((state) => {
                  state.employeeCreateModal = true;

                  return { ...state };
                })
              }
            />
            <FloatButton
              icon={
                <BsFillPersonCheckFill style={{ verticalAlign: "middle" }} />
              }
            />
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
      <Modal
        open={state.employeeCreateModal}
        footer={false}
        onCancel={() => closeModal("employeeCreate")}
      >
        <CreateEmployee
          close={() => {
            closeModal("employeeCreate");
            loadEmployees();
          }}
        />
      </Modal>
      <Modal
        open={state.employeeUpdateModal}
        footer={false}
        onCancel={() => closeModal("employeeUpdate")}
      >
        <UpdateEmployee
          key={state.employee?.rowid}
          close={() => {
            closeModal("employeeUpdate");
            loadEmployees();
          }}
          data={state.employee}
        />
      </Modal>
    </Layout>
  );
}

export default App;

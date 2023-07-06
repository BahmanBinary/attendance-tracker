import {
  Button,
  Card,
  DatePicker,
  Empty,
  FloatButton,
  Modal,
  Popconfirm,
  Table,
} from "antd";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { MdDangerous } from "react-icons/md";
import CreateEmployee from "../../forms/Employee/Create";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteAttendance,
  deleteEmployee,
  selectAttendance,
  selectEmployee,
  selectSetting,
} from "../../kit/helpers/database";
import UpdateEmployee from "../../forms/Employee/Update";
import { employeeDetails } from "../../kit/helpers/calculations";
import dayjs from "dayjs";

function Employees() {
  const [state, setState] = useState({
    employeeCreateModal: false,
    employeeUpdateModal: false,
    employee: null,
    employees: [],
    statisticMonth: dayjs().startOf("M").valueOf(),
  });

  useEffect(() => {
    setTimeout(() => {
      loadEmployees();
    });
  }, [state.statisticMonth]);

  const loadEmployees = useCallback(() => {
    selectEmployee().then((employeeResult) =>
      selectAttendance().then((attendanceResult) =>
        selectSetting().then((settingResult) => {
          const settings = Object.fromEntries(
            settingResult.map((item) => [item.option, JSON.parse(item.value)])
          );

          setState((currentState) => {
            const attendances = attendanceResult.filter(
              (attendance) =>
                attendance.created_at >= currentState.statisticMonth &&
                attendance.created_at <=
                  dayjs(currentState.statisticMonth).endOf("M").valueOf()
            );
            const details = employeeDetails(
              employeeResult,
              attendances,
              settings
            );

            currentState.employees = employeeResult;

            currentState.employees = currentState.employees.map(
              (item, index) => {
                item.row = index + 1;
                item.key = item.rowid;

                return { ...item, ...details[item.rowid] };
              }
            );

            return { ...currentState };
          });
        })
      )
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
        title: "اضافه کار (دقیقه)",
        dataIndex: "overtime",
        key: "overtime",
        render: (value) => value ?? 0,
      },
      {
        title: "تاخیر (دقیقه)",
        dataIndex: "delay",
        key: "delay",
        render: (value) => value ?? 0,
      },
      {
        title: "مرخصی روزانه (روز)",
        dataIndex: "complete_leaves",
        key: "complete_leaves",
        render: (value) => value ?? 0,
      },
      {
        title: "مرخصی ساعتی (ساعت)",
        dataIndex: "hourly_leaves",
        key: "hourly_leaves",
        render: (value) => value ?? 0,
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
                  deleteAttendance({ employee_id: record.rowid });
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
    <>
      <Card
        style={{ marginBottom: 25 }}
        bodyStyle={{ display: "flex", flexDirection: "row" }}
      >
        <span
          style={{ verticalAlign: "middle", marginLeft: 10, marginTop: 3 }}
        >
          انتخاب ماه آماری:
        </span>
        <DatePicker
          style={{ direction: "ltr" }}
          disabledDate={(current) => current > dayjs()}
          format="YYYY/MM"
          picker="month"
          onChange={(value) =>
            setState((currentState) => {
              currentState.statisticMonth = value.startOf("M").valueOf();

              return { ...currentState };
            })
          }
          value={dayjs(state.statisticMonth)}
        />
      </Card>
      <Table
        columns={columns}
        dataSource={state.employees}
        locale={{ emptyText: <Empty description="داده ای موجود نیست!" /> }}
      />
      <FloatButton
        tooltip="ثبت کارمند"
        type="primary"
        icon={<BsFillPersonPlusFill style={{ verticalAlign: "middle" }} />}
        onClick={() =>
          setState((state) => {
            state.employeeCreateModal = true;

            return { ...state };
          })
        }
      />
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
    </>
  );
}

export default Employees;

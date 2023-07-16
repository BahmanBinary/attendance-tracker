import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  FloatButton,
  Input,
  Modal,
  Popconfirm,
  Row,
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

const { RangePicker } = DatePicker;

function Employees() {
  const [state, setState] = useState({
    employeeCreateModal: false,
    employeeUpdateModal: false,
    employee: null,
    employees: [],
    statisticRange: [
      dayjs().startOf("M").startOf("d").valueOf(),
      dayjs().valueOf(),
    ],
    statisticMonthHolidays: 0,
    newRender: 0,
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    setTimeout(() => {
      loadEmployees();
    });
  }, [state.statisticRange, state.firstName, state.lastName]);

  const loadEmployees = useCallback(() => {
    selectEmployee().then((employeeResult) =>
      selectAttendance().then((attendanceResult) =>
        selectSetting().then((settingResult) => {
          const settings = Object.fromEntries(
            settingResult.map((item) => [item.option, JSON.parse(item.value)])
          );

          setState((currentState) => {
            settings.holidays = settings.holidays.filter(
              (date) =>
                dayjs(date, { jalali: true }).valueOf() >=
                  dayjs(currentState.statisticRange[0]).valueOf() &&
                dayjs(date, { jalali: true }).valueOf() <=
                  dayjs(currentState.statisticRange[1]).valueOf()
            );
            currentState.statisticMonthHolidays = settings.holidays.length;

            const attendances = attendanceResult.filter(
              (attendance) =>
                attendance.entrance >= currentState.statisticRange[0] &&
                attendance.entrance <= currentState.statisticRange[1]
            );
            const details = employeeDetails(
              employeeResult,
              attendances,
              settings
            );

            if (currentState.firstName || currentState.lastName)
              currentState.employees = employeeResult.filter(
                (employee) =>
                  (currentState.firstName !== "" &&
                  !employee.first_name
                    .toLowerCase()
                    .includes(currentState.firstName.toLowerCase())
                    ? false
                    : true) &&
                  (currentState.lastName !== "" &&
                  !employee.last_name
                    .toLowerCase()
                    .includes(currentState.lastName.toLowerCase())
                    ? false
                    : true)
              );
            else currentState.employees = employeeResult;

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
      <Card style={{ marginBottom: 25 }}>
        <Row gutter={[20, 20]}>
          <Col span={6} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ verticalAlign: "middle", marginLeft: 10 }}>
              نام:
            </span>
            <Input
              onChange={(event) =>
                setState((currentState) => {
                  currentState.firstName = event.target.value;

                  return { ...currentState };
                })
              }
              value={state.firstName}
            />
          </Col>
          <Col span={8} style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                verticalAlign: "middle",
                marginLeft: 10,
                whiteSpace: "nowrap",
              }}
            >
              نام خانوادگی:
            </span>
            <Input
              onChange={(event) =>
                setState((currentState) => {
                  currentState.lastName = event.target.value;

                  return { ...currentState };
                })
              }
              value={state.lastName}
            />
          </Col>
          <Col span={10}>
            <span
              style={{
                verticalAlign: "middle",
                marginLeft: 10,
                whiteSpace: "nowrap",
              }}
            >
              انتخاب بازه آماری:
            </span>
            <RangePicker
              style={{ direction: "ltr" }}
              disabledDate={(current) => current > dayjs()}
              onChange={(value) =>
                setState((currentState) => {
                  currentState.statisticRange = value
                    ? [
                        value[0].startOf("d").valueOf(),
                        value[1].endOf("d").valueOf(),
                      ]
                    : [
                        dayjs().startOf("M").startOf("d").valueOf(),
                        dayjs().valueOf(),
                      ];

                  return { ...currentState };
                })
              }
              value={[
                dayjs(state.statisticRange[0]),
                dayjs(state.statisticRange[1]),
              ]}
            />
          </Col>
          <Col span={12}>
            <span style={{ verticalAlign: "middle", marginLeft: 10 }}>
              تعداد تعطیلات بازه آماری:
            </span>
            <span style={{ verticalAlign: "middle" }}>
              {state.statisticMonthHolidays}
            </span>
          </Col>
        </Row>
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
          key={state.newRender}
          close={() => {
            closeModal("employeeCreate");
            loadEmployees();
            setState((currentState) => {
              currentState.newRender = Date.now();

              return { ...currentState };
            });
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

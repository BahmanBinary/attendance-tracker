import { Button, Empty, FloatButton, Modal, Popconfirm, Table } from "antd";
import { AiFillDelete, AiFillEdit, AiOutlineCheck } from "react-icons/ai";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { MdDangerous } from "react-icons/md";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteAttendance,
  selectAttendance,
  selectEmployee,
} from "../../kit/helpers/database";
import UpdateAttendance from "../../forms/Attendance/Update";
import CreateAttendance from "../../forms/Attendance/Create";
import dayjs from "dayjs";

function Attendances() {
  const [state, setState] = useState({
    attendanceCreateModal: false,
    attendanceUpdateModal: false,
    attendance: null,
    attendances: [],
    newRender: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      loadAttendances();
    });
  }, []);

  const loadAttendances = useCallback(() => {
    selectAttendance().then((attendanceResult) => {
      selectEmployee().then((employeeResult) => {
        const employees = Object.fromEntries(
          employeeResult.map((employeeItem) => [
            employeeItem.rowid,
            `${employeeItem.first_name} ${employeeItem.last_name}`,
          ])
        );

        setState((currentState) => {
          currentState.attendances = attendanceResult.reverse();

          currentState.attendances = currentState.attendances.map(
            (item, index) => {
              item.row = index + 1;
              item.key = item.rowid;
              item.employee_name = employees[item.employee_id];

              return item;
            }
          );

          return { ...currentState };
        });
      });
    });
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
      { title: "نام کارمند", dataIndex: "employee_name", key: "employeeName" },
      {
        title: "زمان ورود",
        dataIndex: "entrance",
        key: "entrance",
        render: (value) =>
          value && (
            <span
              style={{
                direction: "ltr",
                unicodeBidi: "plaintext",
                fontWeight: 500,
              }}
            >
              {dayjs(parseInt(value)).format("YYYY/MM/DD HH:mm")}
            </span>
          ),
      },
      {
        title: "زمان خروج",
        dataIndex: "exit",
        key: "exit",
        render: (value) =>
          value && (
            <span
              style={{
                direction: "ltr",
                unicodeBidi: "plaintext",
                fontWeight: 500,
              }}
            >
              {dayjs(parseInt(value)).format("YYYY/MM/DD HH:mm")}
            </span>
          ),
      },
      {
        title: "مرخصی",
        dataIndex: "leave",
        key: "leave",
        render: (value) => (value ? <AiOutlineCheck /> : null),
      },
      {
        title: "نوع مرخصی",
        dataIndex: "leave_type",
        key: "leave_type",
        render: (value) => value && (value === "complete" ? "کامل" : "ساعتی"),
      },
      {
        title: "مقدار مرخصی ساعتی (ساعت)",
        dataIndex: "leave_hours",
        key: "leave_hours",
      },
      {
        title: " ",
        key: "actions",
        render: (value, record, index) => {
          const iconSize = 18;

          return (
            <div style={{ direction: "ltr" }}>
              <Popconfirm
                title="حذف حضور"
                description="آیا از حذف این حضور اطمینان دارید؟"
                onConfirm={() => {
                  deleteAttendance({ rowid: record.rowid });
                  loadAttendances();
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
                    record.entrance = record.entrance || Date.now();
                    record.exit = record.exit || Date.now();

                    record.leave_type =
                      record.leave_type === "hourly" ? true : false;

                    currentState.attendance = record;
                    currentState.attendanceUpdateModal = true;

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
      <Table
        columns={columns}
        dataSource={state.attendances}
        locale={{ emptyText: <Empty description="داده ای موجود نیست!" /> }}
      />
      <FloatButton
        tooltip="اعلام حضور"
        type="primary"
        icon={<BsFillPersonCheckFill style={{ verticalAlign: "middle" }} />}
        onClick={() =>
          setState((state) => {
            state.attendanceCreateModal = true;

            return { ...state };
          })
        }
      />
      <Modal
        open={state.attendanceCreateModal}
        footer={false}
        onCancel={() => closeModal("attendanceCreate")}
      >
        <CreateAttendance
          key={state.newRender}
          close={() => {
            closeModal("attendanceCreate");
            loadAttendances();
            setState((currentState) => {
              currentState.newRender = Date.now();

              return { ...currentState };
            });
          }}
        />
      </Modal>
      <Modal
        open={state.attendanceUpdateModal}
        footer={false}
        onCancel={() => closeModal("attendanceUpdate")}
      >
        <UpdateAttendance
          key={state.attendance?.rowid}
          close={() => {
            closeModal("attendanceUpdate");
            loadAttendances();
          }}
          data={state.attendance}
        />
      </Modal>
    </>
  );
}

export default Attendances;

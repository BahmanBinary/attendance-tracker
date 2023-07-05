import {
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Checkbox,
  InputNumber,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { selectEmployee, updateAttendance } from "../../kit/helpers/database";
import dayjs from "dayjs";

export default function UpdateAttendance({ close, data }) {
  const [state, setState] = useState({
    employees: [],
    leave: data.leave || false,
    hourlyLeave: data.leave_type,
  });

  useEffect(() => {
    setTimeout(() => {
      loadEmployees();
    });
  }, []);

  const loadEmployees = useCallback(() => {
    selectEmployee().then((result) =>
      setState((currentState) => {
        currentState.employees = result;

        currentState.employees = currentState.employees.map((item, index) => ({
          value: item.rowid,
          label: `${item.first_name} ${item.last_name}`,
        }));

        return { ...currentState };
      })
    );
  }, []);

  const save = useCallback(
    (values) => {
      if (!values.leave) {
        values.leave_hours = "";
        values.leave_type = "";
        values.leave = 0;
        values.entrance = dayjs(values.entrance).valueOf();
        values.exit = dayjs(values.exit).valueOf();
      } else {
        values.entrance = "";
        values.exit = "";
        values.leave = 1;
        values.leave_type = values.leave_type ? "hourly" : "complete";

        if (!values.leave_hours) {
          delete values.leave_hours;
          values.leave_type = "complete";
        }
      }

      updateAttendance({ rowid: data.rowid }, values);
      close();
    },
    [data]
  );

  return (
    <Form
      initialValues={
        data && {
          ...data,
          entrance: dayjs(data.entrance),
          exit: dayjs(data.exit),
        }
      }
      layout="vertical"
      style={{ marginTop: 30 }}
      onFinish={save}
    >
      <Row gutter={10}>
        <Col span={24}>
          <Form.Item
            label="نام کارمند"
            name="employee_id"
            rules={[{ required: true, message: "ضروری است" }]}
          >
            <Select options={state.employees} />
          </Form.Item>
        </Col>
        {state.leave || (
          <>
            <Col span={12}>
              <Form.Item
                label="زمان ورود"
                name="entrance"
                rules={[{ required: true, message: "ضروری است" }]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  disabledDate={(current) => current > dayjs()}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="زمان خروج"
                name="exit"
                rules={[{ required: true, message: "ضروری است" }]}
              >
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%" }}
                  disabledDate={(current) => current > dayjs()}
                />
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={8}>
          <Form.Item name="leave" valuePropName="checked">
            <Checkbox
              onChange={(event) =>
                setState((currentState) => {
                  currentState.leave = event.target.checked;

                  return { ...currentState };
                })
              }
            >
              مرخصی
            </Checkbox>
          </Form.Item>
        </Col>
        {state.leave && (
          <>
            <Col span={8}>
              <Form.Item name="leave_type" valuePropName="checked">
                <Checkbox
                  onChange={(event) =>
                    setState((currentState) => {
                      currentState.hourlyLeave = event.target.checked;

                      return { ...currentState };
                    })
                  }
                >
                  مرخصی ساعتی
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="مقدار مرخصی ساعتی (ساعت)" name="leave_hours">
                <InputNumber
                  disabled={!state.hourlyLeave}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={24}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: 20 }}
            >
              ذخیره
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Select,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { insertAttendance, selectEmployee } from "../../kit/helpers/database";
import dayjs from "dayjs";

export default function CreateAttendance({ close }) {
  const [state, setState] = useState({
    employees: [],
    leave: false,
    hourlyLeave: false,
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

  const save = useCallback((values) => {
    if (!values.leave) {
      values.leave = 0;

      values.entrance = dayjs(values.entrance).startOf("m").valueOf();
      values.exit = values.exit
        ? dayjs(values.exit).startOf("m").valueOf()
        : "";
    } else {
      values.leave = 1;
      values.leave_type = values.leave_type ? "hourly" : "complete";

      if (!values.leave_hours) {
        delete values.leave_hours;
        values.leave_type = "complete";
      }
    }

    insertAttendance({ ...values, created_at: dayjs().valueOf() });
    close();
  }, []);

  return (
    <Form layout="vertical" style={{ marginTop: 30 }} onFinish={save}>
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
                  style={{ width: "100%", direction: "ltr" }}
                  disabledDate={(current) => current > dayjs()}
                  format="YYYY/MM/DD HH:mm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="زمان خروج" name="exit">
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  style={{ width: "100%", direction: "ltr" }}
                  disabledDate={(current) => current > dayjs()}
                  format="YYYY/MM/DD HH:mm"
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

import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { insertAttendance, selectEmployee } from "../../kit/helpers/database";
import dayjs from "dayjs";

export default function CreateAttendance({ close }) {
  const [state, setState] = useState({
    employees: [],
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
    insertAttendance({
      employeeID: values.employee_id,
      entrance: values.entrance,
      exit: values.exit,
    });
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
          <Form.Item
            label="زمان خروج"
            name="exit"
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

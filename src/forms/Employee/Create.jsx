import { Button, Col, Form, Input, Row } from "antd";
import { useCallback } from "react";
import { insertEmployee } from "../../kit/helpers/database";

export default function CreateEmployee({ close }) {
  const save = useCallback((values) => {
    insertEmployee({
      firstName: values.firstName,
      lastName: values.lastName,
      rank: values.rank,
      serviceLocation: values.serviceLocation,
    });
    close();
  }, []);

  return (
    <Form layout="vertical" style={{ marginTop: 30 }} onFinish={save}>
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item
            label="نام"
            name="firstName"
            rules={[{ required: true, message: "ضروری است" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="نام خانوادگی"
            name="lastName"
            rules={[{ required: true, message: "ضروری است" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="درجه"
            name="rank"
            rules={[{ required: true, message: "ضروری است" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="محل خدمت"
            name="serviceLocation"
            rules={[{ required: true, message: "ضروری است" }]}
          >
            <Input />
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

import { Button, Col, Form, Input, Row } from "antd";
import { useCallback } from "react";
import { updateEmployee } from "../../kit/helpers/database";

export default function UpdateEmployee({ close, data }) {
  const save = useCallback(
    (values) => {
      updateEmployee(
        { rowid: data.rowid },
        {
          first_name: values.first_name,
          last_name: values.last_name,
          rank: values.rank,
          service_location: values.service_location,
        }
      );
      close();
    },
    [data]
  );

  return (
    <Form
      initialValues={data}
      layout="vertical"
      style={{ marginTop: 30 }}
      onFinish={save}
    >
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item
            label="نام"
            name="first_name"
            rules={[{ required: true, message: "ضروری است" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="نام خانوادگی"
            name="last_name"
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
            name="service_location"
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

import { Button, Card, Col, Form, Row, Slider } from "antd";
import { useCallback, useEffect, useState } from "react";
import { selectSetting, updateSetting } from "../../kit/helpers/database";
import dayjs from "dayjs";

const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنج شنبه",
];

function Settings() {
  const [state, setState] = useState({
    settings: {},
  });

  useEffect(() => {
    setTimeout(() => {
      loadSettings();
    });
  }, []);

  const loadSettings = useCallback(() => {
    selectSetting().then((result) =>
      setState((currentState) => {
        currentState.settings = result;

        currentState.settings = Object.fromEntries(
          currentState.settings.map((item, index) => {
            return [item.option, JSON.parse(item.value)];
          })
        );

        return { ...currentState };
      })
    );
  }, []);

  return (
    <Card>
      {Object.entries(state.settings).length ? (
        <Form
          initialValues={state.settings}
          layout="vertical"
          style={{ marginTop: 30 }}
          defaultValue={state.settings}
          onFinish={save}
        >
          <Row gutter={10}>
            {new Array(6).fill().map((item, index) => {
              return (
                <Col key={index} span={24} style={{ marginBottom: 15 }}>
                  <Form.Item
                    label={weekDays[index]}
                    name={["working_hours", index]}
                  >
                    <Slider
                      range
                      tooltip={{
                        open: true,
                        formatter: sliderTooltipFormatter,
                        placement: "bottom",
                      }}
                      min={0}
                      max={288}
                    />
                  </Form.Item>
                </Col>
              );
            })}
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
      ) : null}
    </Card>
  );
}

export default Settings;

function save(values) {
  for (const [option, value] of Object.entries(values))
    updateSetting({ option }, { value: JSON.stringify(value) });
}

function sliderTooltipFormatter(value) {
  return dayjs()
    .startOf("d")
    .add(value * 5, "m")
    .format("HH:mm");
}

import { Button, Card, Col, DatePicker, Form, Row, Slider } from "antd";
import { useCallback, useEffect, useState } from "react";
import { selectSetting, updateSetting } from "../../kit/helpers/database";
import { AiFillCloseCircle } from "react-icons/ai";
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

        currentState.settings.holidays = currentState.settings.holidays.map(
          (item) =>
            dayjs(item, {
              jalali: true,
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
            <Col span={24}>
              <h3>ساعات کاری</h3>
            </Col>
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
          </Row>
          <Row gutter={10} style={{ marginTop: 30 }}>
            <Col span={24}>
              <h3>روزهای تعطیل</h3>
            </Col>
            <Form.List name="holidays">
              {(fields, { add, remove }) => (
                <>
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        htmlType="button"
                        style={{ width: "100%" }}
                        onClick={() => add()}
                      >
                        افزودن
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Row gutter={[10, 10]}>
                      {fields.map((field, index) => (
                        <Col
                          span={3}
                          key={field.key}
                          style={{
                            display: "flex",
                            flexDirection: "row-reverse",
                          }}
                        >
                          <Form.Item name={field.name}>
                            <DatePicker
                              style={{ width: "100%", direction: "ltr" }}
                              format="YYYY/MM/DD"
                            />
                          </Form.Item>
                          <Button
                            htmlType="button"
                            type="text"
                            shape="circle"
                            icon={
                              <AiFillCloseCircle
                                color="#888"
                                style={{
                                  verticalAlign: "middle",
                                }}
                              />
                            }
                            onClick={() => remove(index)}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </>
              )}
            </Form.List>
          </Row>
          <Row gutter={10}>
            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", marginTop: 80 }}
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
  values.holidays = values.holidays
    .filter((item) => item && item.type !== "click")
    .map((holiday) => holiday.format("YYYY/MM/DD"));

  for (const [option, value] of Object.entries(values))
    updateSetting({ option }, { value: JSON.stringify(value) });
}

function sliderTooltipFormatter(value) {
  return dayjs()
    .startOf("d")
    .add(value * 5, "m")
    .format("HH:mm");
}

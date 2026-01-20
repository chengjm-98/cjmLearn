import React from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  DatePicker,
  Radio,
  message,
} from "antd";

// ===== 字段库 =====
const fieldLibrary = [
  {
    name: "username",
    label: "用户名",
    type: "input",
    rules: [{ required: true, message: "请输入用户名" }],
    value: "",
  },
  {
    name: "age",
    label: "年龄",
    type: "input",
    rules: [{ required: true, message: "请输入年龄" }],
    value: "",
  },
  {
    name: "gender",
    label: "性别",
    type: "radio",
    options: ["男", "女"],
    value: "男",
  },
  {
    name: "hobbies",
    label: "爱好",
    type: "checkbox",
    options: ["读书", "运动", "旅游"],
    value: [],
  },
  { name: "birth", label: "生日", type: "date", value: null },
  {
    name: "country",
    label: "国家",
    type: "select",
    options: ["中国", "美国", "英国"],
    value: "中国",
  },
];

// ===== 模板库 =====
const templateLibrary = [
  { name: "basicInfo", fields: ["username", "age", "gender", "birth"] },
  { name: "preferences", fields: ["hobbies", "country"] },
];

// ===== 页面库 =====
const pageLibrary = [
  { name: "userFormPage", templates: ["basicInfo", "preferences"] },
];

// ===== 工厂模式渲染控件 =====
const fieldMap = {
  input: (props) => <Input {...props} />,
  select: (props) => (
    <Select {...props}>
      {props.options?.map((opt) => (
        <Select.Option key={opt} value={opt}>
          {opt}
        </Select.Option>
      ))}
    </Select>
  ),
  checkbox: (props) => <Checkbox.Group {...props} options={props.options} />,
  radio: (props) => (
    <Radio.Group {...props}>
      {props.options?.map((opt) => (
        <Radio key={opt} value={opt}>
          {opt}
        </Radio>
      ))}
    </Radio.Group>
  ),
  date: (props) => <DatePicker {...props} style={{ width: "100%" }} />,
};

const FieldFactory = (field) => {
  const Component = fieldMap[field.type];
  if (!Component) return null;
  return <Component options={field.options} />;
};

const DynamicForm = ({ pageName }) => {
  const [form] = Form.useForm();

  // 获取页面配置
  const page = pageLibrary.find((p) => p.name === pageName);
  if (!page) return <div>页面未找到</div>;

  // 获取模板下的字段
  const fieldsToRender = page.templates
    .flatMap((templateName) => {
      const template = templateLibrary.find((t) => t.name === templateName);
      if (!template) return [];
      return template.fields.map((fieldName) =>
        fieldLibrary.find((f) => f.name === fieldName),
      );
    })
    .filter((f) => f);

  const onFinish = (values) => {
    console.log("提交表单数据:", values);
    message.success("提交成功");
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {fieldsToRender.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          rules={field.rules}
          initialValue={field.value}
        >
          {FieldFactory(field)}
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
          重置
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;

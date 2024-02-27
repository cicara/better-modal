import { Input, Modal } from "antd";
import { useModalContext } from "../lib";
import { Form } from "antd";
import { useCallback, useEffect } from "react";

export type MyModalProps = {
  value?: string;
};

export function MyModal(props: MyModalProps) {
  const modal = useModalContext<string>();

  const [form] = Form.useForm();

  const handleSubmit = useCallback(
    (values: { name: string }) => {
      modal.resolve(values.name);
    },
    [modal.resolve]
  );

  useEffect(() => {
    if (!modal.visible) {
      return;
    }
    form.setFieldsValue({ name: props.value });
  }, [props.value]);

  return (
    <Modal
      open={modal.visible}
      title="What's your name?"
      onOk={() => form.submit()}
      onCancel={() => modal.reject(new Error("user cancel"))}
      afterClose={modal.destroy}
    >
      <Form form={form} onFinish={handleSubmit} autoComplete="off">
        <Form.Item name="name" rules={[{ required: true }]}>
          <Input placeholder="your name..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}

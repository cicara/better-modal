# Better Modal

A tool to help simplify antd modal state management

## Installation

```shell
pnpm add @cicara/better-modal
```

## Usage

1. Create an Antd Modal in the usual way, with the only difference that the state of the Modal is managed automatically using `useModalContext`.

   ```tsx
   import { Input, Modal } from "antd";
   import { useModalContext } from "@cicara/better-modal";
   import { Form } from "antd";
   import { useCallback, useEffect } from "react";

   export type MyModalProps = {
     value?: string;
   };

   export function MyModal(props: MyModalProps) {
     const modal = useModalContext<string>(); // <- First use modal context

     const [form] = Form.useForm();

     const handleSubmit = useCallback(
       (values: { name: string }) => {
         modal.resolve(values.name); // <- Close the modal and return the data or message
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
         onCancel={() => modal.reject(new Error("user cancel"))} // <- Close modal with reject and reason
         afterClose={modal.destroy} // Optional, destroy the modal
       >
         <Form form={form} onFinish={handleSubmit} autoComplete="off">
           <Form.Item name="name" rules={[{ required: true }]}>
             <Input placeholder="your name..." />
           </Form.Item>
         </Form>
       </Modal>
     );
   }
   ```

2. Use the `useModal<string>(MyModal)` react hook to create the modal and insert `{myModal.placeholder}` in the right place so that the modal can get the Context correctly.

   ```tsx
   import { useModal } from "@cicara/better-modal";
   import { MyModal } from "./my-modal";

   export function App() {
     const myModal = useModal(MyModal);

     return <div>{myModal.placeholder}</div>;
   }
   ```

3. Use the `myModal.show` function to display the modal and passing props, the `show` function returns a Promise, which corresponds to the `resolve` and `reject` function in the `useModalContext`.

   ```tsx
   import { Button } from "antd";
   import { useModal } from "@cicara/better-modal";
   import { MyModal } from "./my-modal";
   import { useCallback } from "react";

   export function App() {
     const myModal = useModal(MyModal);

     const handleOpenModal = useCallback(async () => {
       try {
         const result = await myModal.show<string>({ value: "hungtcs" });
         alert(result);
       } catch (err) {
         alert(err);
       }
     }, []);

     return (
       <div>
         <Button onClick={handleOpenModal}>Open Modal</Button>
         {myModal.placeholder}
       </div>
     );
   }
   ```

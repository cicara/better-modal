import { Button } from "antd";
import { useCallback } from "react";
import { useModal } from "../lib";
import { MyModal } from "./my-modal";

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
      <h2>App Working...</h2>
      <div>
        <Button onClick={handleOpenModal}>Open Modal</Button>
      </div>
      {myModal.placeholder}
    </div>
  );
}

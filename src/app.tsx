import { Button } from "antd";
import { useModal } from "../lib";
import { MyModal } from "./my-modal";
import { useCallback } from "react";

export function App() {
  const myModal = useModal<string>(MyModal);

  const handleOpenModal = useCallback(async () => {
    try {
      const result = await myModal.show({ value: "hungtcs" });
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

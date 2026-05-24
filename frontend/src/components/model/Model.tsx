import { useState, type SetStateAction } from "react";
import { addItem } from "../../api/dataApi";
import "./model.css";

type status = "idle" | "loading" | "success" | "error";

export default function Model({
  setIsOpen,
  onSuccess
}: {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>,
  onSuccess: ()=> void
}) {
  const [name, setName] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [status, setStatus] = useState<status>("idle");
  const [isRequired, setIsRequired] = useState<boolean>(false);

  async function handleSave() {
    if (!name || !price) {
      setIsRequired(true);
      return;
    }
    setIsRequired(false);
    setStatus("loading");
    const newItem = { name, price: +price, quantity: quantity ? +quantity : 0 };

    try {
      await addItem(newItem);
      setStatus("success");
      setTimeout(() => {
        setIsOpen(false);
        onSuccess()
      }, 2000);
    } catch (error) {
      setStatus("error");

      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }
  }

  return (
    <div className="add-item-container">
      {status === "idle" && (
        <div className="add-item">
          <h3>new item</h3>
          <label htmlFor="name">name*</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
          {isRequired && !name && <p className="error">name is required</p>}
          <label htmlFor="price">price*</label>
          <input
            type="text"
            id="price"
            name="price"
            onChange={(e) => setPrice(e.target.value)}
          />
          {isRequired && !price && <p className="error">price is required</p>}

          <label htmlFor="quantity">quantity</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button onClick={handleSave}>save</button>
        </div>
      )}
      {status === "loading" && <p>edding item...</p>}
      {status === "success" && <h2>item added successfully</h2>}
      {status === "error" && <h2 className="error">error in edding item</h2>}
    </div>
  );
}

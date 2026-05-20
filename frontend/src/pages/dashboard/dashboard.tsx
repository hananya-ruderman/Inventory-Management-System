import "./dashboard.css";
import { useUser } from "../../state/user";
import { Table } from "../../components/table/table";
import { useState, useEffect } from "react";
import { fetchItems } from "../../api/dataApi";
import type { Item } from "../../models/types";

export default function Dashboard() {
  const { currentUser, setCurrentUser } = useUser();
  const [data, setData] = useState<Item[]>([]);
  const [filteredData, setFilteredData] = useState<Item[] | null>(null);
  const [newItem, setNewItem] = useState<Item | null>(null);

  currentUser
    ? localStorage.setItem("currentUser", currentUser)
    : setCurrentUser(localStorage.getItem("currentUser"));

  useEffect(() => {
    async function loadData() {
      try {
        const items = await fetchItems();
        setData(items.items);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    }
    loadData();
  }, []);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    const searchedData = data.filter((item: Item) => {
      return item.name.includes(query);
    });
    setFilteredData(searchedData);
  }

  async function handleAdd() {}

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Mazpenlogo.png/500px-Mazpenlogo.png"
          alt="Logo"
          className="logo"
        />
        <div className="user-info">
          <span>Welcome, {currentUser}!</span>
        </div>
        <search className="search-bar">
          <input onChange={handleSearch} type="text" placeholder="Search..." />
        </search>
      </nav>
      <aside className="sidebar">
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Products</a>
          </li>
          <li>
            <a href="#">Orders</a>
          </li>
          <li>
            <a href="#">Customers</a>
          </li>
          <li>
            <a href="#">Reports</a>
          </li>
        </ul>
      </aside>
      <main className="dashboard-content">
        <h2 className="head-main">
          Dashboard <button onClick={handleAdd}>add item</button>
        </h2>
        <Table data={filteredData ?? data} setData={setData} />
      </main>
    </div>
  );
}

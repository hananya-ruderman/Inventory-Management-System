import './dashboard.css'
import {useUser} from '../../state/user';
import { Table } from '../../components/table/table';
import { useState, useEffect } from 'react';
import { fetchItems } from '../../api/dataApi';
import type { Item } from '../../models/types';


export default function Dashboard() {
    const { currentUser } = useUser();
    const [data, setData] = useState<Item[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const items = await fetchItems();
                console.log(items);
                setData(items);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        }
        loadData();
    }, []);

    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        const query = event.target.value;
        console.log("Search query:", query);
    }

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Mazpenlogo.png/500px-Mazpenlogo.png" alt="Logo" className="logo" />
                <div className="user-info">
                    <span>Welcome, {currentUser}!</span>
                </div>
                <search className="search-bar">
                    <input onChange = {handleSearch} type="text" placeholder="Search..." />
                </search>
            </nav>
            <aside className="sidebar">
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Products</a></li>
                    <li><a href="#">Orders</a></li>
                    <li><a href="#">Customers</a></li>
                    <li><a href="#">Reports</a></li>
                </ul>
            </aside>
            <main className="dashboard-content">
                <h2>Dashboard</h2>
                <Table data={data} />
            </main>
        </div>
    );
}
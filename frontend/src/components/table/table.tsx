import type {Item} from '../../models/types';
import './table.css';

export function Table({data}: { data: Item[] }) {

    function handleEdit(row: Item) {
        console.log("Edit", row);
    }

    function handleDelete(row: Item) {
        console.log("Delete", row);
    }

    if (data.length === 0) {
        return <p>No data available</p>;
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    {Object.keys(data[0]).map((key) => (
                        <th key={key}>{key}</th>
                    ))}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id as string | number}>
                        {Object.values(row).map((value, i) => (
                            <td key={i}>{value as string | number}</td>
                        ))}
                        <td>
                            <button onClick={() => handleEdit(row)}>Edit</button>
                            <button onClick={() => handleDelete(row)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
import React from "react";

const ReusableTable = ({ data, columns, onView }) => {
    return (
        <table border="1">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key}>{column.label}</th>
                    ))}
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {columns.map((column) => (
                            <td key={column.key}>
                                {item[column.key]}
                            </td>
                        ))}
                        <td>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#userModal"
                                onClick={() => onView(item)}>
                                View
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ReusableTable;
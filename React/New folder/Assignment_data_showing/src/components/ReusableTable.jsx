import React from "react";

const ReusableTable = ({ data, columns, onView }) => {
    return (
        <div className="table-responsive">

            <table className="table table-bordered table-striped table-hover">

                <thead className="table-dark">
                    <tr>

                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}

                        <th>View</th>

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
                                    className="btn btn-primary btn-sm"
                                    onClick={() => onView(item)}
                                >
                                    View
                                </button>
                            </td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default ReusableTable;
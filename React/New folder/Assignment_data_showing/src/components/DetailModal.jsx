import React from "react";

const DetailModal = ({ item, title, onClose }) => {

    if (!item) {
        return null;
    }

    return (
        <div
            className="modal fade show"
            tabIndex="-1"
            style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}
        >

            <div className="modal-dialog modal-lg">

                <div className="modal-content">

                    {/* Header */}

                    <div className="modal-header">

                        <h5 className="modal-title">
                            {title} Details
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>


                    {/* Body */}

                    <div className="modal-body">

                        {Object.entries(item).map(([key, value]) => (

                            <div
                                className="mb-3"
                                key={key}
                            >

                                <strong>
                                    {key}
                                </strong>

                                <p className="mb-0">
                                    {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : value}
                                </p>

                            </div>

                        ))}

                    </div>


                    {/* Footer */}

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default DetailModal;
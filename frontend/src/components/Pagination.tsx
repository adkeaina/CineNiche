import { useState, KeyboardEvent } from "react";

interface PaginationProps {
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    setPageNumber: (pageNumber: number) => void;
    setPageSize: (pageSize: number) => void;
}

const Pagination = ({ totalPages, pageNumber, pageSize, setPageNumber, setPageSize }: PaginationProps) => {
    const [inputValue, setInputValue] = useState(pageNumber.toString())

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          updatePageNumber();
        }
    }

    const updatePageNumber = () => {
        const num = parseInt(inputValue, 10)
        if (!isNaN(num)) {
            if (num <=totalPages && num >= 1) {
                setPageNumber(num);
            } else if (num > totalPages) {
                setPageNumber(totalPages);
            } else {
                setPageNumber(1);
            }
        }

    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center mt-4">
                <button
                    className="btn btn-outline-primary mx-2 rounded-pill shadow-sm"
                    disabled={pageNumber === 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                >
                    Previous
                </button>

                <input
                    id="pageInput"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={updatePageNumber}
                    className="form-control"
                    style={{ width: "100px" }}
                />

                <button
                    className="btn btn-outline-primary mx-2 rounded-pill shadow-sm"
                    disabled={pageNumber === totalPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                >
                    Next
                </button>
            </div>

            <div className="d-flex justify-content-center align-items-center mt-3">
                <label className="form-label mb-0 mx-2">
                    Results per page:
                </label>
                <select
                    className="form-select form-select-sm rounded-pill shadow-sm w-auto"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNumber(1); // Reset to first page when changing page size
                    }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
        </>
    )
}

export default Pagination;
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  useTable,
  useSortBy,
  usePagination,
  Column,
  TableInstance,
  UseSortByInstanceProps,
  UsePaginationInstanceProps,
  UseSortByState,
  UsePaginationState,
  HeaderGroup,
} from "react-table";
import DocumentForm from "./DocumentForm"; // Import the DocumentForm component
import "./DocumentTable.css"; // Import the CSS file

interface Document {
  id: number;
  title: string;
  author: string;
  created_at: string;
  last_edited?: string; // Add last edited date
  file?: File | string; // Add file field
}

// Extend the TableInstance type to include pagination and sorting
type TableInstanceWithHooks<T extends object> = TableInstance<T> &
  UseSortByInstanceProps<T> &
  UsePaginationInstanceProps<T> & {
    state: UseSortByState<T> & UsePaginationState<T>;
  };

// Extend the HeaderGroup type to include sorting props
type HeaderGroupWithSort<T extends object> = HeaderGroup<T> & {
  getSortByToggleProps: () => any;
  isSorted: boolean;
  isSortedDesc: boolean;
};

const DocumentTable: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null); // State to store the document being edited

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        setDocuments(
          res.data.map((doc: any) => ({
            id: doc.id,
            title: doc.title,
            author: "Unknown",
            created_at: new Date().toLocaleDateString(),
            last_edited: new Date().toLocaleDateString(), // Initialize last edited date
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }, []);

  // Define columns with proper typing
  const columns = useMemo<Column<Document>[]>(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Title", accessor: "title" },
      { Header: "Author", accessor: "author" },
      { Header: "Created At", accessor: "created_at" },
      { Header: "Last Edited", accessor: "last_edited" },
      {
        Header: "Actions",
        Cell: ({ row }: { row: any }) => (
          <button className="edit-button" onClick={() => handleEdit(row.original)}>
            Edit
          </button>
        ),
      },
    ],
    []
  );

  // Filter documents based on search input
  const filteredDocs = useMemo(
    () =>
      documents.filter((doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase())
      ),
    [documents, search]
  );

  // Use React Table hooks with proper typing
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
  } = useTable<Document>(
    {
      columns,
      data: filteredDocs,
      initialState: { pageIndex: 0, pageSize: 10 } as any, // Use `as any` to bypass TypeScript error
    },
    useSortBy,
    usePagination
  ) as TableInstanceWithHooks<Document>; // Cast to the extended type

  // Handle form submission
  const handleFormSubmit = (data: any) => {
    const updatedDocument = {
      ...data,
      last_edited: new Date().toLocaleDateString(), // Update last edited date
    };

    if (selectedDocument) {
      // Update existing document
      const updatedDocuments = documents.map((doc) =>
        doc.id === selectedDocument.id ? updatedDocument : doc
      );
      setDocuments(updatedDocuments);
    } else {
      // Add new document
      const newDocument = {
        ...updatedDocument,
        id: documents.length + 1,
        created_at: new Date().toLocaleDateString(), // Set creation date
      };
      setDocuments([...documents, newDocument]);
    }
    setShowForm(false); // Hide the form after submission
    setSelectedDocument(null); // Reset selected document
  };

  // Handle edit button click
  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setShowForm(true);
  };

  return (
    <div className="document-table-container">
      <h2>Document Management</h2>
      <button className="add-document-button" onClick={() => setShowForm(true)}>
        Add Document
      </button>
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Display the form as a pop-up when showForm is true */}
      {showForm && (
        <DocumentForm
          onSubmit={handleFormSubmit}
          defaultValues={selectedDocument || undefined}
          onClose={() => setShowForm(false)} // Close the modal
        />
      )}

      <table {...getTableProps()} className="document-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => {
                // Cast the column to HeaderGroupWithSort to access sorting props
                const sortColumn = column as HeaderGroupWithSort<Document>;
                return (
                  <th
                    {...sortColumn.getHeaderProps(
                      sortColumn.getSortByToggleProps()
                    )}
                    key={sortColumn.id}
                  >
                    {sortColumn.render("Header")}
                    {/* Add sort direction indicator */}
                    {sortColumn.isSorted
                      ? sortColumn.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          aria-label="Previous Page"
        >
          Previous
        </button>
        <span className="page-number">Page {pageIndex + 1}</span>
        <button
          className="pagination-button"
          onClick={() => nextPage()}
          disabled={!canNextPage}
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DocumentTable;

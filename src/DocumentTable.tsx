import React, { useEffect, useMemo, useState } from "react";
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

interface Document {
  id: number;
  title: string;
  author: string;
  created_at: string;
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

  return (
    <div>
      <h2>Document Management</h2>
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table {...getTableProps()} border={1} style={{ width: "100%" }}>
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

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          aria-label="Previous Page"
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {pageIndex + 1}</span>
        <button
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

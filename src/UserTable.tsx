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
import UserForm from "./UserForm"; // Import the existing UserForm
import "./UserTable.css"; // Import the CSS file

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
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

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showAddUserForm, setShowAddUserForm] = useState(false); // State to control Add User form visibility

  // Fetch users from the API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle adding a new user
  const handleAddUser = async (newUser: Omit<User, "id">) => {
    try {
      // Send a POST request to add the new user
      const response = await axios.post("http://localhost:3001/users", {
        ...newUser,
        id: users.length + 1, // Generate a new ID (mock API will handle this automatically)
      });
      setUsers([...users, response.data]); // Update the local state
      setShowAddUserForm(false); // Hide the Add User form
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Filter users based on search input
  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  // Define columns with proper typing
  const columns = useMemo<Column<User>[]>(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Role", accessor: "role" },
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
  } = useTable<User>(
    {
      columns,
      data: filteredUsers,
      initialState: { pageIndex: 0, pageSize: 10 } as any, // Use `as any` to bypass TypeScript error
    },
    useSortBy,
    usePagination
  ) as TableInstanceWithHooks<User>; // Cast to the extended type

  // Handle edit button click
  const handleEdit = (user: User) => {
    // Implement edit functionality here
    console.log("Edit user:", user);
  };

  return (
    <div className="user-table-container">
      <h2>User Management</h2>
      <button className="add-user-button" onClick={() => setShowAddUserForm(true)}>
        Add User
      </button>
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Add User Form */}
      {showAddUserForm && (
        <UserForm
          onSubmit={handleAddUser}
          onClose={() => setShowAddUserForm(false)}
        />
      )}

      <table {...getTableProps()} className="user-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => {
                // Cast the column to HeaderGroupWithSort to access sorting props
                const sortColumn = column as HeaderGroupWithSort<User>;
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

export default UserTable;

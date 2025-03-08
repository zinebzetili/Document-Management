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
import UserForm from "./UserForm"; // Import the UserForm component

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
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State to store the user being edited

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

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
          <button onClick={() => handleEdit(row.original)}>Edit</button>
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
    page,
    prepareRow,
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

  // Handle form submission
  const handleFormSubmit = (data: any) => {
    if (selectedUser) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, ...data } : user
      );
      setUsers(updatedUsers);
    } else {
      // Add new user
      const newUser = { ...data, id: users.length + 1 };
      setUsers([...users, newUser]);
    }
    setShowForm(false); // Hide the form after submission
    setSelectedUser(null); // Reset selected user
  };

  // Handle edit button click
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  return (
    <div>
      <h2>User Management</h2>
      <button onClick={() => setShowForm(true)}>Add User</button>
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Display the form when showForm is true */}
      {showForm && (
        <UserForm
          onSubmit={handleFormSubmit}
          defaultValues={selectedUser || undefined}
        />
      )}

      <table {...getTableProps()} border={1} style={{ width: "100%" }}>
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

export default UserTable;

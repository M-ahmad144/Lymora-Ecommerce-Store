import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Snackbar,
  createTheme,
  ThemeProvider,
  Paper,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";

// Dark Theme Configuration
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f44336",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#9e9e9e",
    },
  },
});

const UserList = () => {
  const { data, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUser, setEditableUser] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully!");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (user) => {
    setEditableUser({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  };

  const updateHandler = async () => {
    try {
      await updateUser({
        userId: editableUser.id,
        username: editableUser.username,
        email: editableUser.email,
      });

      setEditableUser(null);
      setSnackbarMessage("User updated successfully!");
      setSnackbarOpen(true);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const users = data?.users || [];

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="flex justify-center p-4">
        <div className="w-full md:w-4/5">
          <Typography
            variant="h4"
            component="h1"
            align="center"
            className="text-pink-500"
            gutterBottom
          >
            Users
          </Typography>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Paper elevation={3} sx={{ padding: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: "100%", overflowX: "auto" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID</TableCell>
                      <TableCell align="center">NAME</TableCell>
                      <TableCell align="center">EMAIL</TableCell>
                      <TableCell align="center">ADMIN</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                          {user._id}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                          {editableUser?.id === user._id ? (
                            <div className="flex flex-wrap items-center">
                              <TextField
                                variant="outlined"
                                value={editableUser.username}
                                onChange={(e) =>
                                  setEditableUser({
                                    ...editableUser,
                                    username: e.target.value,
                                  })
                                }
                                size="small"
                                color="primary"
                                sx={{
                                  backgroundColor: "#333",
                                  borderRadius: "4px",
                                  width: "150px",
                                  marginRight: "8px",
                                }}
                              />
                              <IconButton
                                onClick={updateHandler}
                                color="primary"
                                sx={{ fontSize: "1rem" }}
                              >
                                <FaCheck />
                              </IconButton>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              {user.username}{" "}
                              <IconButton
                                onClick={() => toggleEdit(user)}
                                sx={{ marginLeft: "8px" }}
                              >
                                <FaEdit />
                              </IconButton>
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: "0.8rem" }}>
                          {editableUser?.id === user._id ? (
                            <div className="flex flex-wrap items-center">
                              <TextField
                                variant="outlined"
                                value={editableUser.email}
                                onChange={(e) =>
                                  setEditableUser({
                                    ...editableUser,
                                    email: e.target.value,
                                  })
                                }
                                size="small"
                                color="primary"
                                sx={{
                                  backgroundColor: "#333",
                                  borderRadius: "4px",
                                  width: "150px",
                                  marginRight: "8px",
                                }}
                              />
                              <IconButton
                                onClick={updateHandler}
                                color="primary"
                                sx={{ fontSize: "1rem" }}
                              >
                                <FaCheck />
                              </IconButton>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <a href={`mailto:${user.email}`}>{user.email}</a>
                              <IconButton
                                onClick={() => toggleEdit(user)}
                                sx={{ marginLeft: "8px" }}
                              >
                                <FaEdit />
                              </IconButton>
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {user.isAdmin ? (
                            <FaCheck style={{ color: "green" }} />
                          ) : (
                            <FaTimes style={{ color: "red" }} />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {!user.isAdmin && (
                            <Button
                              onClick={() => deleteHandler(user._id)}
                              color="secondary"
                              variant="contained"
                              sx={{
                                minWidth: "30px",
                                padding: "4px 8px",
                                fontSize: "0.8rem",
                              }}
                            >
                              <FaTrash />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </div>
    </ThemeProvider>
  );
};

export default UserList;

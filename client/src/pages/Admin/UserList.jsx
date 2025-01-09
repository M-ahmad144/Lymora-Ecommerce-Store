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
    <div className="flex justify-center p-4">
      <div className="w-full md:w-4/5">
        <Typography
          variant="h4"
          component="h1"
          align="center"
          className="text-pink-500"
          gutterBottom
          sx={{ color: "white" }} // Set the title text to white
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
          <TableContainer>
            <Table sx={{ minWidth: "100%", overflowX: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ color: "white" }}>
                    ID
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    NAME
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    EMAIL
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    ADMIN
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.8rem", color: "white" }}
                    >
                      {user._id}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.8rem", color: "white" }}
                    >
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
                              color: "white", // Text inside textfield will be white
                            }}
                          />
                          <IconButton
                            onClick={updateHandler}
                            color="primary"
                            sx={{ fontSize: "1rem", color: "white" }}
                          >
                            <FaCheck />
                          </IconButton>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.username}{" "}
                          <IconButton
                            onClick={() => toggleEdit(user)}
                            sx={{ marginLeft: "8px", color: "white" }}
                          >
                            <FaEdit />
                          </IconButton>
                        </div>
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.8rem", color: "white" }}
                    >
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
                              color: "white", // Text inside textfield will be white
                            }}
                          />
                          <IconButton
                            onClick={updateHandler}
                            color="primary"
                            sx={{ fontSize: "1rem", color: "white" }}
                          >
                            <FaCheck />
                          </IconButton>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <a
                            href={`mailto:${user.email}`}
                            style={{ color: "white" }}
                          >
                            {user.email}
                          </a>
                          <IconButton
                            onClick={() => toggleEdit(user)}
                            sx={{ marginLeft: "8px", color: "white" }}
                          >
                            <FaEdit />
                          </IconButton>
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
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
                            color: "white", // Button text color will be white
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
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default UserList;

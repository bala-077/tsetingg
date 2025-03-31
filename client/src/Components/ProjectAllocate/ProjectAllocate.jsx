import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TextField,
  TableRow,
  TableCell,
  DialogTitle,
  Dialog,
  DialogContent,
  FormControl,
  DialogActions,
  TableBody,
  Container,
  Button,
  CircularProgress,
  Box,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import SearchIcon from "@material-ui/icons/Search";
import { useForm } from "./../../Custom-Hook/userForm";
import { fetchTeamLeader } from "./../../Api/Users/Users";
import { fetchBooks } from "./../../Api/Books/Books";
import { checkToken } from "../../Api/Users/Users";
import { useHistory } from "react-router";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";

function ProjectAllocate() {
  const [editModal, setEditModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [processing, setProcessing] = useState(false);
  const [userType, setUserType] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [TL, setTL] = useState([]);

  const history = useHistory();

  const [bookForm, handleChange, setBookForm] = useForm({
    projectId: "",
    projectname: "",
    codinglanguage: "",
    databasename: "",
    duration: "",
    registerdate: "",
    description: "",
    plname: "",
    stage: "Not Started",
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchApi = async () => {
      setLoadingProjects(true);
      try {
        const res = await checkToken();
        if (res === undefined || res.status === 401) history.push("/");

        const [usersData, booksData] = await Promise.all([
          fetchTeamLeader(),
          fetchBooks()
        ]);

        if (!isCancelled) {
          setUserType(res.data.userType);
          setUsers(usersData);
          setProjects(booksData);
        }
      } catch (error) {
        console.error(error);
        setErrorAlert("Failed to fetch data. Please try again later.");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchApi();
    return () => (isCancelled = true);
  }, [history]);

  const updateProject = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await axios.post("http://localhost:4000/api/allocate/create", bookForm);
      setAlert("Project leader allocated successfully.");
      setEditModal(false);
      getTL();
    } catch (err) {
      setErrorAlert("Error while allocating project leader.");
    } finally {
      setProcessing(false);
    }
  };

  const getTL = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/allocate/get-allocation");
      setTL(response.data.data.map((item) => ({
        projectName: item.projectname,
        teamLead: item.plname,
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTL();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.projectname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const editDialog = (
    <Dialog open={editModal} onClose={() => setEditModal(false)} scroll="body" maxWidth="md" fullWidth>
      <form onSubmit={updateProject}>
        <DialogTitle>
          <Typography variant="h6" component="div">
            Allocate Project Leader
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {errorAlert && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorAlert}
              </Alert>
            )}
            {alert && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {alert}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={bookForm.projectname}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Coding Language"
                  value={bookForm.codinglanguage}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Database"
                  value={bookForm.databasename}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={bookForm.duration}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={bookForm.description}
                  multiline
                  rows={3}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => option.name}
                  value={users.find((user) => user.name === bookForm.plname) || null}
                  onChange={(event, newValue) => {
                    setBookForm((prev) => ({
                      ...prev,
                      plname: newValue ? newValue.name : "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Project Developer" variant="outlined" />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModal(false)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {processing ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Allocation
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Coding Language</TableCell>
              <TableCell>Database</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Project Lead</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingProjects ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 3 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">No projects found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((book) => (
                <TableRow key={book.id} hover>
                  <TableCell>{book.projectname}</TableCell>
                  <TableCell>{book.codinglanguage}</TableCell>
                  <TableCell>{book.databasename}</TableCell>
                  <TableCell>{book.duration}</TableCell>
                  <TableCell>{book.description}</TableCell>
                  <TableCell>
                    {TL.find((t) => t.projectName === book.projectname)?.teamLead || "Not Allocated"}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      startIcon={<EditIcon />}
                      color="primary"
                      onClick={() => {
                        setBookForm(book);
                        setEditModal(true);
                      }}
                    >
                      Allocate
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {editDialog}
    </Container>
  );
}

export default ProjectAllocate;
import React, { useState, useEffect } from 'react'
import {
  Paper,
  Grid,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  DialogTitle,
  Dialog,
  DialogContent,
  FormControl,
  DialogActions,
  DialogContentText,
  TableBody,
  Container,
  Button,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import styles from './Books.module.css'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import SearchIcon from '@material-ui/icons/Search'
import { useForm } from './../../Custom-Hook/userForm'
import {
  fetchBooks,
  createBook,
  editBook,
  deleteBook,
} from './../../Api/Books/Books'
import { checkToken } from '../../Api/Users/Users'
import { useHistory } from 'react-router'
import { formatDate } from './../../Tools/Tools'
import Alert from '@material-ui/lab/Alert'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined'
import { debounce } from 'lodash'

function Projects() {
  const [createModal, setCreateModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [projects, setProjects] = useState([])
  const [alert, setAlert] = useState('')
  const [errorAlert, setErrorAlert] = useState('')
  const [processing, setProcessing] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(false)

  const history = useHistory()

  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      const res = await checkToken()
      if (res === undefined || res.status === 401) {
        history.push('/')
        return
      }
      if (!isCancelled) {
        setUserType(res.data.userType)
      }
    }
    fetchApi().catch(console.error)
    return () => (isCancelled = true)
  }, [history])

  const [projectForm, handleChange, setProjectForm] = useForm({
    projectname: '',
    codinglanguage: '',
    databasename: '',
    duration: '',
    registerdate: '',
    description: '',
  })

  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      setLoading(true)
      try {
        const projectsData = await fetchBooks()
        if (!isCancelled) {
          setProjects(projectsData)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }
    fetchApi()
    return () => (isCancelled = true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    try {
      const res = isEdit ? await editBook(projectForm) : await createBook(projectForm)
      if (res.status === 200 || res.status === 201) {
        setCreateModal(false)
        if (isEdit) {
          setProjects(projects.map((project) => (project.id === res.data.id ? res.data : project)))
          setAlert(<Alert severity="success">Project updated successfully</Alert>)
        } else {
          setProjects([res.data, ...projects])
          setAlert(<Alert severity="success">Project added successfully</Alert>)
        }
        setTimeout(() => setAlert(''), 5000)
      } else {
        setErrorAlert(<Alert severity="error">{res.data.error}</Alert>)
        setTimeout(() => setErrorAlert(''), 10000)
      }
    } catch (error) {
      setErrorAlert(<Alert severity="error">An error occurred. Please try again.</Alert>)
      setTimeout(() => setErrorAlert(''), 10000)
    }
    setProcessing(false)
  }

  const handleDelete = async () => {
    setProcessing(true)
    try {
      const res = await deleteBook(projectForm)
      if (res.status === 200 || res.status === 204) {
        setDeleteAlert(false)
        setProjects(projects.filter((project) => project.id !== projectForm.id))
        setProjectForm({
          projectname: '',
          codinglanguage: '',
          databasename: '',
          duration: '',
          registerdate: '',
          description: '',
          dateCreated: '',
        })
        setAlert(<Alert severity="success">Project deleted successfully</Alert>)
        setTimeout(() => setAlert(''), 5000)
      }
    } catch (error) {
      setErrorAlert(<Alert severity="error">Failed to delete project</Alert>)
      setTimeout(() => setErrorAlert(''), 10000)
    }
    setProcessing(false)
  }

  const searchChange = debounce(async (text) => {
    setLoading(true)
    try {
      const projectsData = await fetchBooks(text)
      setProjects(projectsData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, 500)

  const resetForm = () => {
    setProjectForm({
      projectname: '',
      codinglanguage: '',
      databasename: '',
      duration: '',
      registerdate: '',
      description: '',
      dateCreated: '',
    })
  }

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Projects Management
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search projects..."
              onChange={(e) => searchChange(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" style={{ marginRight: 8 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            {userType === 'admin' && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<AddIcon />}
                onClick={() => {
                  setIsEdit(false)
                  resetForm()
                  setCreateModal(true)
                }}
              >
                Add New Project
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      {alert}
      {errorAlert}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Database</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Register Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created</TableCell>
              {userType === 'admin' && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box py={4}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary">No projects found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>{project.projectname}</TableCell>
                  <TableCell>{project.codinglanguage}</TableCell>
                  <TableCell>{project.databasename}</TableCell>
                  <TableCell>{project.duration}</TableCell>
                  <TableCell>{project.registerdate}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{formatDate(project.dateCreated)}</TableCell>
                  {userType === 'admin' && (
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setIsEdit(true)
                            setProjectForm(project)
                            setCreateModal(true)
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setProjectForm(project)
                            setDeleteAlert(true)
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={createModal}
        onClose={() => {
          setCreateModal(false)
          resetForm()
        }}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
          <DialogContent>
            <Box py={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    name="projectname"
                    label="Project Name"
                    value={projectForm.projectname}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    name="codinglanguage"
                    label="Programming Language"
                    value={projectForm.codinglanguage}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    name="databasename"
                    label="Database Name"
                    value={projectForm.databasename}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    name="duration"
                    label="Duration"
                    value={projectForm.duration}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    name="registerdate"
                    label="Register Date"
                    type="date"
                    value={projectForm.registerdate}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    name="description"
                    label="Description"
                    value={projectForm.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setCreateModal(false)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={processing}
              startIcon={isEdit ? <SaveIcon /> : <AddIcon />}
            >
              {isEdit ? 'Save Changes' : 'Add Project'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteAlert}
        onClose={() => {
          setDeleteAlert(false)
          resetForm()
        }}
        maxWidth="xs"
      >
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" py={2}>
            <CancelOutlinedIcon
              style={{
                color: '#e74c3c',
                fontSize: 64,
                marginBottom: 16,
              }}
            />
            <DialogContentText align="center">
              Are you sure you want to delete <strong>{projectForm.projectname}</strong>?
              This action cannot be undone.
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteAlert(false)
            resetForm()
          }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={processing}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Projects
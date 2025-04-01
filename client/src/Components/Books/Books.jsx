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
  Card,
  CardContent,
  Divider,
  useTheme,
  makeStyles,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import styles from './Books.module.css'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import SearchIcon from '@material-ui/icons/Search'
import VisibilityIcon from '@material-ui/icons/Visibility'
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

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  searchField: {
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
    '& .MuiTableCell-head': {
      color: 'white',
      fontWeight: 600,
    },
  },
  tableRow: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  actionButton: {
    margin: theme.spacing(0, 1),
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '& .MuiTypography-root': {
      color: 'white',
    },
  },
  dialogContent: {
    padding: theme.spacing(4),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
  statsCard: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statsTitle: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  statsValue: {
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  viewDialog: {
    padding: theme.spacing(3),
  },
  viewDialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '& .MuiTypography-root': {
      color: 'white',
    },
  },
  viewDialogContent: {
    padding: theme.spacing(3),
  },
  detailList: {
    width: '100%',
  },
  detailListItem: {
    padding: theme.spacing(1, 0),
  },
  detailLabel: {
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  detailValue: {
    color: theme.palette.text.primary,
  },
  descriptionBox: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
}));

function Projects() {
  const classes = useStyles();
  const theme = useTheme();
  const [createModal, setCreateModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [projects, setProjects] = useState([])
  const [alert, setAlert] = useState('')
  const [errorAlert, setErrorAlert] = useState('')
  const [processing, setProcessing] = useState(false)
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [viewDialog, setViewDialog] = useState(false);

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
          setProjects(projects.map((project) => (project._id === res.data._id ? res.data : project)))
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
        const res = await deleteBook(projectForm._id)
        if (res.status === 204 || res.status === 200) {
            setDeleteAlert(false)
            setProjects(projects.filter((project) => project._id !== projectForm._id))
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
        } else {
            const errorMessage = res.data?.error || 'Failed to delete project'
            setErrorAlert(<Alert severity="error">{errorMessage}</Alert>)
            setTimeout(() => setErrorAlert(''), 10000)
        }
    } catch (error) {
        console.error('Delete error:', error)
        setErrorAlert(<Alert severity="error">Failed to delete project. Please try again.</Alert>)
        setTimeout(() => setErrorAlert(''), 10000)
    } finally {
        setProcessing(false)
    }
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

  const handleView = (project) => {
    setProjectForm(project);
    setViewDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
          {userType === 'admin' && (
            <button
              onClick={() => {
                setIsEdit(false)
                resetForm()
                setCreateModal(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <AddIcon className="h-5 w-5 mr-2" />
              Add New Project
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                onChange={(e) => searchChange(e.target.value)}
                placeholder="Search projects..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
              <dd className="mt-1 text-3xl font-semibold text-indigo-600">{projects.length}</dd>
            </div>
          </div>
        </div>

        {alert && <div className="mb-4">{alert}</div>}
        {errorAlert && <div className="mb-4">{errorAlert}</div>}

        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Project Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Language
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Database
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Register Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Description
                  </th>
                  
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CircularProgress className="text-indigo-600" size={40} />
                        <p className="mt-4 text-sm text-gray-500">Loading projects...</p>
                      </div>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                          <svg className="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium">No projects found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr 
                      key={project._id} 
                      className="hover:bg-gray-50 transition-all duration-200 ease-in-out group relative"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                              <span className="text-indigo-600 font-semibold text-lg">
                                {project.projectname.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                              {project.projectname}
                            </div>
                            <div className="text-xs text-gray-500">Project ID: {project._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
                          <div>
                            <div className="text-sm text-gray-900">{project.codinglanguage}</div>
                            <div className="text-xs text-gray-500">Programming Language</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                          <div>
                            <div className="text-sm text-gray-900">{project.databasename}</div>
                            <div className="text-xs text-gray-500">Database</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
                          <div>
                            <div className="text-sm text-gray-900">{project.duration}</div>
                            <div className="text-xs text-gray-500">Duration</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-purple-400 mr-2"></div>
                          <div>
                            <div className="text-sm text-gray-900">{project.registerdate}</div>
                            <div className="text-xs text-gray-500">Register Date</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
                            {project.description}
                          </div>
                          <div className="text-xs text-gray-500">Description</div>
                        </div>
                      </td>
                    
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={() => handleView(project)}
                              className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 transition-all duration-200 transform hover:scale-110"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {userType === 'admin' && (
                            <>
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => {
                                    setIsEdit(true)
                                    setProjectForm(project)
                                    setCreateModal(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => {
                                    setProjectForm(project)
                                    setDeleteAlert(true)
                                  }}
                                  className="text-red-600 hover:text-red-900 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog
          open={createModal}
          onClose={() => {
            setCreateModal(false)
            resetForm()
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className={classes.dialogTitle}>
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <form onSubmit={handleSubmit}>
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
                    className={classes.formField}
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
                    className={classes.formField}
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
                    className={classes.formField}
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
                    className={classes.formField}
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
                    className={classes.formField}
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
                    className={classes.formField}
                  />
                </Grid>
              </Grid>
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
          </DialogContent>
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
                  color: theme.palette.error.main,
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

        <Dialog
          open={viewDialog}
          onClose={() => setViewDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className={classes.viewDialogTitle}>
            Project Details
          </DialogTitle>
          <DialogContent className={classes.viewDialogContent}>
            <List className={classes.detailList}>
              <ListItem className={classes.detailListItem}>
                <ListItemText
                  primary="Project Name"
                  secondary={projectForm.projectname}
                  primaryTypographyProps={{ className: classes.detailLabel }}
                  secondaryTypographyProps={{ className: classes.detailValue }}
                />
              </ListItem>
              <ListItem className={classes.detailListItem}>
                <ListItemText
                  primary="Programming Language"
                  secondary={projectForm.codinglanguage}
                  primaryTypographyProps={{ className: classes.detailLabel }}
                  secondaryTypographyProps={{ className: classes.detailValue }}
                />
              </ListItem>
              <ListItem className={classes.detailListItem}>
                <ListItemText
                  primary="Database Name"
                  secondary={projectForm.databasename}
                  primaryTypographyProps={{ className: classes.detailLabel }}
                  secondaryTypographyProps={{ className: classes.detailValue }}
                />
              </ListItem>
              <ListItem className={classes.detailListItem}>
                <ListItemText
                  primary="Duration"
                  secondary={projectForm.duration}
                  primaryTypographyProps={{ className: classes.detailLabel }}
                  secondaryTypographyProps={{ className: classes.detailValue }}
                />
              </ListItem>
              <ListItem className={classes.detailListItem}>
                <ListItemText
                  primary="Register Date"
                  secondary={projectForm.registerdate}
                  primaryTypographyProps={{ className: classes.detailLabel }}
                  secondaryTypographyProps={{ className: classes.detailValue }}
                />
              </ListItem>
              <ListItem className={classes.detailListItem}>
                <ListItemText
                  primary="Created Date"
                  secondary={formatDate(projectForm.dateCreated)}
                  primaryTypographyProps={{ className: classes.detailLabel }}
                  secondaryTypographyProps={{ className: classes.detailValue }}
                />
              </ListItem>
            </List>
            <Box className={classes.descriptionBox}>
              <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 600 }}>
                Description
              </Typography>
              <Typography variant="body1">
                {projectForm.description}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default Projects
import React, { useState, useEffect } from 'react'
import {
  Grid,
  TextField,
  Container,
  Button,
  TableContainer,
  Paper,
  DialogContentText,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  DialogActions,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import Alert from '@material-ui/lab/Alert'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined'
import PersonIcon from '@material-ui/icons/Person'
import { formatDate } from './../../Tools/Tools'
import { useForm } from './../../Custom-Hook/userForm'
import { fetchUsers, createUser, editUser, deleteUser } from './../../Api/Users/Users'
import { checkToken } from '../../Api/Users/Users'
import { useHistory } from 'react-router'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  tableRow: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  modalTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2),
  },
  modalContent: {
    padding: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1, 2),
    fontSize: '0.875rem',
    minWidth: '5px',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  actionButton: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0.5),
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  roleChip: {
    marginLeft: theme.spacing(1),
    height: '24px',
    '& .MuiChip-label': {
      fontSize: '0.75rem',
      padding: '0 8px',
    },
  },
  searchField: {
    marginBottom: theme.spacing(2),
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.divider,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  addButton: {
    background: theme.palette.success.main,
    color: theme.palette.common.white,
    padding: theme.spacing(0.75, 2),
    fontSize: '0.875rem',
    '&:hover': {
      background: theme.palette.success.dark,
    },
  },
  deleteIcon: {
    color: theme.palette.error.main,
  },
  editIcon: {
    color: theme.palette.success.main,
  },
  tableText: {
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
  },
  tableHeaderText: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  emptyStateText: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  dialogTitle: {
    fontSize: '1.25rem',
    fontWeight: 500,
  },
  dialogText: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
  userAvatar: {
    width: 32,
    height: 32,
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
}))

function UserManagement() {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [userForm, handleChange, setUserForm] = useForm({
    name: '',
    username: '',
    password: '',
    userType: '',
  })
  const [createModal, setCreateModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' })
  const [deleteAlert, setDeleteAlert] = useState(false)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const history = useHistory()

  // Fetching user data and handling token
  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      try {
        const res = await checkToken()
        if (res === undefined || res.status === 401) {
          history.push('/')
        } else if (!isCancelled) {
          setUserType(res.data.userType)
        }
      } catch (e) {
        console.error('Auth error:', e)
      }
    }
    fetchApi()
    return () => (isCancelled = true)
  }, [history])

  // Fetch users and set them to state
  useEffect(() => {
    let isCancelled = false
    const fetchApi = async () => {
      try {
        const res = await fetchUsers()
        if (!isCancelled) {
          setUsers(res)
          setFilteredUsers(res)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        setAlert({
          open: true,
          message: 'Failed to load users',
          severity: 'error',
        })
        setLoading(false)
      }
    }
    fetchApi()
    return () => (isCancelled = true)
  }, [])

  // Handle search query and filter users
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false })
  }

  const registerUser = async (e) => {
    e.preventDefault()
    setProcessing(true)
    try {
      const res = isEdit ? await editUser(userForm) : await createUser(userForm)
      if (res.status === 200 || res.status === 201) {
        setCreateModal(false)
        if (isEdit) {
          setUsers(users.map((user) => (user.id === res.data.id ? res.data : user)))
          setAlert({
            open: true,
            message: 'Successfully edited User',
            severity: 'success',
          })
        } else {
          setUsers([res.data, ...users])
          setAlert({
            open: true,
            message: 'Successfully added new User',
            severity: 'success',
          })
        }
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.error || 'An error occurred',
        severity: 'error',
      })
    }
    setProcessing(false)
  }

  const destroyUser = async () => {
    setProcessing(true)
    try {
      const res = await deleteUser(userForm)
      if (res.status === 200 || res.status === 204) {
        setDeleteAlert(false)
        setUsers(users.filter((user) => user.id !== userForm.id))
        setUserForm({ username: '', name: '', password: '', userType: '' })
        setAlert({
          open: true,
          message: 'Successfully deleted User',
          severity: 'success',
        })
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to delete user',
        severity: 'error',
      })
    }
    setProcessing(false)
  }

  // Dialogs (Add/Edit, Delete)
  const addDialog = (
    <Dialog
      open={createModal}
      onClose={() => {
        setCreateModal(false)
        setUserForm({
          name: '',
          username: '',
          password: '',
          userType: 'Project Manager',
        })
      }}
      scroll="body"
      fullWidth
    >
      <form onSubmit={registerUser} method="post">
        <DialogTitle className={classes.modalTitle}>
          <Typography className={classes.dialogTitle}>
            {isEdit ? 'Edit User' : 'Add New User'}
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                name="name"
                onChange={handleChange}
                value={userForm.name}
                label="Name"
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="username"
                onChange={handleChange}
                value={userForm.username}
                label="Username"
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="password"
                onChange={handleChange}
                value={userForm.password}
                label="Password"
                type="password"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="User Type"
                name="userType"
                value={userForm.userType}
                onChange={handleChange}
                fullWidth
                SelectProps={{
                  native: true,
                }}
              >
                <option value="admin">Admin</option>
                <option value="PM">Project Manager</option>
                <option value="PL">Project Leader</option>
                <option value="PD">Project Developer</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateModal(false)
              setUserForm({
                name: '',
                username: '',
                password: '',
                userType: 'Project Manager',
              })
            }}
            color="secondary"
            className={classes.button}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={processing}
            className={classes.button}
            endIcon={processing ? <CircularProgress size={20} /> : isEdit ? <SaveIcon /> : <AddIcon />}
          >
            {isEdit ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

  const deleteDialog = (
    <Dialog
      open={deleteAlert}
      onClose={() => {
        setUserForm({ username: '', name: '', password: '', userType: '' })
        setDeleteAlert(false)
      }}
      maxWidth="xs"
    >
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" p={2}>
          <CancelOutlinedIcon
            style={{
              color: '#e74c3c',
              fontSize: 48,
              marginBottom: 16,
            }}
          />
          <Typography variant="h6" gutterBottom className={classes.dialogTitle}>
            Confirm Delete
          </Typography>
          <Typography className={classes.dialogText} align="center">
            Are you sure you want to delete <strong>{userForm.username}</strong>?
            This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setUserForm({ username: '', name: '', password: '', userType: '' })
            setDeleteAlert(false)
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={destroyUser}
          disabled={processing}
          color="secondary"
          variant="contained"
          endIcon={processing ? <CircularProgress size={20} /> : <DeleteIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )

  if (loading) {
    return (
      <div className={classes.loadingSpinner}>
        <CircularProgress size={60} />
      </div>
    )
  }

  return (
    <Container className={classes.root}>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>

      <Box className={classes.header}>
        <Typography variant="h5" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          Manage system users and their roles
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={classes.searchField}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6} container justify="flex-end">
          <Button
            variant="contained"
            className={classes.addButton}
            startIcon={<AddIcon />}
            onClick={() => {
              setCreateModal(true)
              setUserForm({
                name: '',
                username: '',
                password: '',
                userType: 'Project Manager',
              })
            }}
          >
            Add New User
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={3} style={{ marginTop: 24 }}>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell>
                <Typography className={classes.tableHeaderText}>User</Typography>
              </TableCell>
              <TableCell>
                <Typography className={classes.tableHeaderText}>Role</Typography>
              </TableCell>
              <TableCell>
                <Typography className={classes.tableHeaderText}>Username</Typography>
              </TableCell>
              <TableCell>
                <Typography className={classes.tableHeaderText}>Date Created</Typography>
              </TableCell>
              {userType === 'admin' && (
                <TableCell align="right">
                  <Typography className={classes.tableHeaderText}>Actions</Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography className={classes.emptyStateText}>No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={classes.tableRow}>
                  <TableCell>
                    <Box className={classes.userCell}>
                      <Avatar className={classes.userAvatar}>
                        <PersonIcon />
                      </Avatar>
                      <Typography className={classes.userName}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.userType}
                      color={user.userType === 'admin' ? 'primary' : 'default'}
                      size="small"
                      className={classes.roleChip}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography className={classes.tableText}>{user.username}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className={classes.tableText}>{formatDate(user.dateCreated)}</Typography>
                  </TableCell>
                  {userType === 'admin' && (
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          setIsEdit(true)
                          setUserForm(user)
                          setCreateModal(true)
                        }}
                        className={classes.editIcon}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setUserForm(user)
                          setDeleteAlert(true)
                        }}
                        className={classes.deleteIcon}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {addDialog}
      {deleteDialog}
    </Container>
  )
}

export default UserManagement

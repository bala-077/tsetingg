import React, { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import {
  adminListItems,
  studentListItems,
  PLListItems,
  PDListItems,
  secondaryListItems,
} from './ListItems'
import { useStyles } from './Nav.style'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { useHistory } from 'react-router'
import { checkToken } from './../../Api/Users/Users'
import { userData } from '../context/userContext'

export default function Nav(props) {
  const { username, setUsername } = useContext(userData);
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const history = useHistory()
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    let isCancelled = false

    const fetchApi = async () => {
      const res = await checkToken()
      if (res === undefined) history.push('/')
      else if (res.status === 401) history.push('/')
      else if (res.status === 200) {
        if (!isCancelled) {
          sessionStorage.setItem('user', JSON.stringify(res.data))
          setUserType(res.data.userType)
          setUsername(res.data.username)
        }
      }
    }
    try {
      fetchApi()
    } catch (e) {
      console.log(e)
    }
    return () => (isCancelled = true)
  }, [history])

  const handleDrawer = () => {
    setOpen(!open)
  }

  const logout = () => {
    sessionStorage.clear()
    history.push('/')
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            className={clsx(classes.menuButton)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            align="right"
            className={classes.title}
          >
            {username}
          </Typography>
          <IconButton onClick={logout} color="inherit">
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.sidebarLogo}>
          <p className={classes.title1}>
            EMA <span>SYSTEM</span>
          </p>
        </div>
        <Divider />
        <List>
          {userType === 'admin'
            ? adminListItems
            : userType === 'PM'
            ? studentListItems
            : userType === 'PL'
            ? PLListItems
            : userType ==='PD'
            ? PDListItems
            : ''}
        </List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
      <main className={classes.content}>{props.children}</main>
    </div>
  )
}

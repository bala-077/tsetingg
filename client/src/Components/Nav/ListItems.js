import React from 'react'
import { NavLink } from 'react-router-dom'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import {
  FaTachometerAlt,
  FaUsers,
  FaProjectDiagram,
  FaFileAlt,
  FaChartLine,
  FaTasks,
  FaUserCheck,
  FaClipboardList,
  FaComments,
  FaStar,
  FaUserPlus,
  FaClipboardCheck,
} from 'react-icons/fa'

export const adminListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaTachometerAlt />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/books"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaProjectDiagram />
      </ListItemIcon>
      <ListItemText primary="Project Management" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/users"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaUsers />
      </ListItemIcon>
      <ListItemText primary="User Management" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/reports"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaFileAlt />
      </ListItemIcon>
      <ListItemText primary="Project Report" />
    </ListItem>
    <ListItem
      button
      component={NavLink}
      to="/projectstatus"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaChartLine />
      </ListItemIcon>
      <ListItemText primary="Project Status" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/developer-review"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaStar />
      </ListItemIcon>
      <ListItemText primary="Developer Feedback" />
    </ListItem>
  </div>
)

export const studentListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaTachometerAlt />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/projectallocate"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaClipboardCheck />
      </ListItemIcon>
      <ListItemText primary="Project Allocation" />
    </ListItem>
    <ListItem
      button
      component={NavLink}
      to="/projectstatus"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaChartLine />
      </ListItemIcon>
      <ListItemText primary="Project Status" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/developer-review"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaStar />
      </ListItemIcon>
      <ListItemText primary="Developer Feedback" />
    </ListItem>
  </div>
)

// project lead
export const PLListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaTachometerAlt />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/developerallocate"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaUserPlus />
      </ListItemIcon>
      <ListItemText primary="Project Allocation" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/leadstatus"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaChartLine />
      </ListItemIcon>
      <ListItemText primary="Project Status" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/taskallocate"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaTasks />
      </ListItemIcon>
      <ListItemText primary="Task Allocation" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/feedback"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaComments />
      </ListItemIcon>
      <ListItemText primary="FeedBack" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/developer-review"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaStar />
      </ListItemIcon>
      <ListItemText primary="Developer Feedback" />
    </ListItem>
  </div>
)

// project developer
export const PDListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>        <FaTachometerAlt />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/developerproject"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaClipboardList />
      </ListItemIcon>
      <ListItemText primary="Project Allocated" />
    </ListItem>
    <ListItem
      button
      component={NavLink}
      to="/get-task"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <FaTasks />
      </ListItemIcon>
      <ListItemText primary="Project Allocated" />
    </ListItem>
  </div>
)

export const secondaryListItems = (
  <div>
  </div>
)


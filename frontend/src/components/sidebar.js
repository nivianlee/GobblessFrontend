import React from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { makeStyles, useTheme, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(6),
  },

  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: { zIndex: theme.zIndex.drawer + 1 },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const sidebarTheme = createMuiTheme({
  overrides: {
    MuiListItemIcon: {
      root: {
        minWidth: '40px',
      },
    },
  },
});

const Sidebar = (props) => {
  const { container, mobileOpen, handleDrawerToggle, handleSelectedItem, selectedItem } = props;
  const classes = useStyles();
  const theme = useTheme();

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List component='nav' aria-labelledby='nested-list-subheader' className={classes.root}>
        <ListItem button onClick={(event) => handleSelectedItem(event, 0)} selected={selectedItem === 0}>
          <ListItemIcon>
            <LocalHospitalIcon />
          </ListItemIcon>
          <ListItemText primary={'Current'} />
        </ListItem>
        <ListItem button onClick={(event) => handleSelectedItem(event, 1)} selected={selectedItem === 1}>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText primary={'Past'} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={sidebarTheme}>
      <Hidden mdUp>
        <Drawer
          container={container}
          variant='temporary'
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={() => handleDrawerToggle()}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant='permanent'
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </ThemeProvider>
  );
};

export default Sidebar;

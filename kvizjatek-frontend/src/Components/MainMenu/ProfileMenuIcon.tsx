import React from 'react';
import { IconButton, Tooltip, Menu, MenuItem, Avatar } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfileIconMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // DEMO: nincs auth. Alapból "nincs bejelentkezve" menü jelenik meg.
  const loggedIn = false;
  const demoUserName = 'Játékos';

  if (!loggedIn) {
    return (
      <>
        <Tooltip title="Bejelentkezés / Regisztráció">
          <IconButton color="inherit" onClick={handleOpen}>
            <PersonOutlineIcon />
          </IconButton>
        </Tooltip>
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
          <MenuItem onClick={handleClose}>
            <LoginIcon fontSize="small" style={{ marginRight: 8 }} />
            Bejelentkezés
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <AppRegistrationIcon fontSize="small" style={{ marginRight: 8 }} />
            Regisztráció
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <Tooltip title={demoUserName}>
        <IconButton color="inherit" onClick={handleOpen}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {demoUserName?.[0]?.toUpperCase() ?? <AccountCircleIcon />}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <AccountCircleIcon fontSize="small" style={{ marginRight: 8 }} />
          Saját profil
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileIconMenu;
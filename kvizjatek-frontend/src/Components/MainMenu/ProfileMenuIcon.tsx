import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip, Menu, MenuItem, Avatar } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../lib/useAuth';

const ProfileIconMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.username || 'Játékos';

  if (!isAuthenticated) {
    return (
      <>
        <Tooltip title="Bejelentkezés / Regisztráció">
          <IconButton color="inherit" onClick={handleOpen}>
            <PersonOutlineIcon />
          </IconButton>
        </Tooltip>
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              navigate('/login'); // <-- Navigate to /login
              handleClose();
            }}
          >
            <LoginIcon fontSize="small" style={{ marginRight: 8 }} />
            Bejelentkezés
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/register'); // <-- Navigate to /register
              handleClose();
            }}
          >
            <AppRegistrationIcon fontSize="small" style={{ marginRight: 8 }} />
            Regisztráció
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <Tooltip title={userName}>
        <IconButton color="inherit" onClick={handleOpen}>
          <Avatar sx={{ width: 32, height: 32 }}>
            {userName?.[0]?.toUpperCase() ?? <AccountCircleIcon />}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            navigate('/profile'); // <-- Navigate to /profile
            handleClose();
          }}
        >
          <AccountCircleIcon fontSize="small" style={{ marginRight: 8 }} />
          Saját profil
        </MenuItem>
        <MenuItem
          onClick={() => {
            logout(); // <-- Call logout from auth context
            navigate('/');
            handleClose();
          }}
        >
          <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
          Kijelentkezés
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileIconMenu;

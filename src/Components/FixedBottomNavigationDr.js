import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import MenuIcon from '@mui/icons-material/Menu';
import { VideoCameraFrontRounded, AccessAlarmRounded, GroupAddRounded, NotificationsActiveRounded, } from '@mui/icons-material'
import { Link } from 'react-router-dom';


export default function FixedBottomNavigationDr() {
  const [value, setValue] = React.useState('recents');
  // const [role, setRole] = React.useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <BottomNavigation sx={{ width: 400, position: 'fixed', bottom: 0, left: 0, }} value={value} onChange={handleChange}>
      <Link to="/doctor/waitingroom"><BottomNavigationAction icon={<VideoCameraFrontRounded />} /></Link>
      <Link to="/doctor/appointment"><BottomNavigationAction icon={<AccessAlarmRounded />} /></Link>
      <Link to="/doctor/connection"><BottomNavigationAction icon={<GroupAddRounded />} /></Link>
      <Link to="/doctor/notification"><BottomNavigationAction icon={<NotificationsActiveRounded />} /></Link>
      <Link ><BottomNavigationAction icon={<MenuIcon />} /></Link>
    </BottomNavigation>

  );
}


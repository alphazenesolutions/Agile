import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import {
  AccessAlarmRounded,
  AssessmentRounded,
  MessageRounded,
  PendingActionsRounded,
} from '@mui/icons-material'

const actions = [
  { icon: <AccessAlarmRounded />, name: 'Instant Appointment', path: "/mr/instantappointments" },
  { icon: <PendingActionsRounded />, name: 'Set Appointemnt', path: "/mr/setappointments" },
  { icon: <AssessmentRounded />, name: 'Report' },
  { icon: <MessageRounded />, name: 'Message', path: "/mr/messages" },
];

export default function BasicSpeedDial() {
  return (
    <Box >
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            id={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

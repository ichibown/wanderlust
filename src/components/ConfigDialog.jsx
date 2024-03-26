import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const ConfigDialog = ({ userInfo, open, setOpen }) => {
  const [isStravaConfig, setStravaConfig] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSwitch = () => {
    setStravaConfig(!isStravaConfig);
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>
          {isStravaConfig ? 'Strava Authentication Config' : 'User Information Config'}
        </DialogTitle>
        {isStravaConfig ? <StravaConfigContent /> : <UserInfoConfigContent userInfo={userInfo} />}
        <DialogActions>
          <Button onClick={handleSwitch}>
            {isStravaConfig ? 'User Config' : 'Strava Config'}
          </Button>
          <Button type="submit">SAVE</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const UserInfoConfigContent = ({ userInfo }) => {
  return (
    <DialogContent>
      <TextField
        autoFocus
        id="avatar"
        name="avatar"
        label="Avatar URL"
        type="url"
        margin="dense"
        fullWidth
        variant="outlined"
        value={userInfo.avatar}
      />
      <TextField
        autoFocus
        id="name"
        name="name"
        label="Site Name"
        margin="dense"
        type="text"
        fullWidth
        variant="outlined"
        value={userInfo.name}
      />
      <TextField
        autoFocus
        id="motto"
        name="motto"
        label="Site Motto"
        margin="dense"
        type="text"
        fullWidth
        variant="outlined"
        value={userInfo.motto}
      />
      <TextField
        autoFocus
        required
        id="password"
        name="password"
        label="Password"
        margin="dense"
        type="password"
        fullWidth
        variant="outlined"
      />
    </DialogContent>
  )
}

const StravaConfigContent = () => {
  return (
    <DialogContent>
      <TextField autoFocus
        equired
        id="clientId"
        name="clientId"
        label="Client ID"
        margin="dense"
        type="text"
        fullWidth
        variant="outlined"
      />
      <TextField
        autoFocus
        equired
        id="clientSecret"
        name="clientSecret"
        label="Client Secret"
        margin="dense"
        type="text"
        fullWidth
        variant="outlined"
      />
      <TextField
        autoFocus
        required
        id="password"
        name="password"
        label="Password"
        margin="dense"
        type="password"
        fullWidth
        variant="outlined"
      />
    </DialogContent>
  )
}

export default ConfigDialog;

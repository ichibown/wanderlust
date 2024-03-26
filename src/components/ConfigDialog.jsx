import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { postUserConfig, postStravaAuth, postStravaSync } from '../utils/requests';

const ConfigDialog = ({ userInfo, hasStrava, open, setOpen }) => {
  const [isStravaConfig, setStravaConfig] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [resultMessage, setResultMessage] = React.useState('');
  const handleDialogClose = () => {
    setOpen(false);
  };
  const handleSwitch = () => {
    setStravaConfig(!isStravaConfig);
  };
  const handleRequest = (data) => {
    setLoading(true);
    if (isStravaConfig) {
      postStravaAuth(data.clientId, data.clientSecret, data.password, (message) => {
        setLoading(false);
        setResultMessage(message);
      });
    } else {
      postUserConfig(data.avatar, data.name, data.motto, data.password, (message) => {
        setLoading(false);
        setResultMessage(message);
      });
    }
    setOpen(false);
  };
  const handleSync = () => {
    setLoading(true);
    postStravaSync(userInfo.password, (message) => {
      setLoading(false);
      setResultMessage(message);
    });
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            handleRequest(formJson);
          },
        }}>
        <DialogTitle>
          {isStravaConfig ? 'Strava Binding Config' : 'User Information Config'}
        </DialogTitle>
        {isStravaConfig ? <StravaConfigContent /> : <UserInfoConfigContent userInfo={userInfo} />}
        <DialogActions>
          <Button onClick={handleSwitch}>
            {isStravaConfig ? 'User Config' : 'Strava Config'}
          </Button>
          {isStravaConfig && hasStrava ? <Button onClick={handleSync}>Sync</Button> : null}
          <Button type="submit">Update</Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={resultMessage !== ''}
        onClose={() => setResultMessage('')}
        autoHideDuration={3000}
        message={resultMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
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
        type="text"
        margin="dense"
        fullWidth
        variant="outlined"
        defaultValue={userInfo.avatar}
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
        defaultValue={userInfo.name}
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
        defaultValue={userInfo.motto}
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

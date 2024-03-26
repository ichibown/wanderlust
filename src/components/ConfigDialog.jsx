import * as React from 'react';
import { useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Link from '@mui/material/Link';
import { HomeDataContext } from '../App';
import { postUserConfig, postStravaAuth, postStravaSync } from '../utils/requests';
import { DialogContentText } from '@mui/material';

const ConfigDialog = ({ open, setOpen }) => {
  const [isStravaConfig, setStravaConfig] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [resultMessage, setResultMessage] = React.useState('');
  const homeDataState = useContext(HomeDataContext);
  const userInfo = homeDataState.homeData.userInfo || {};
  const hasStrava = homeDataState.homeData.hasStrava;
  const handleDialogClose = () => {
    setOpen(false);
  };
  const handleSwitch = () => {
    setStravaConfig(!isStravaConfig);
  };
  const handleRequest = (data) => {
    setLoading(true);
    if (isStravaConfig) {
      if (data.clientId === '' || data.clientSecret === '') {
        postStravaSync(data.password, (message) => {
          setLoading(false);
          setResultMessage(message);
          homeDataState.refreshHomeData();
        });
      } else {
        postStravaAuth(data.clientId, data.clientSecret, data.password, (message) => {
          setLoading(false);
          setResultMessage(message);
          homeDataState.refreshHomeData();
        });
      }
    } else {
      postUserConfig(data.avatar, data.name, data.motto, data.password, (message) => {
        setLoading(false);
        setResultMessage(message);
        homeDataState.refreshHomeData();
      });
    }
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        scroll='body'
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
        {isStravaConfig ? <StravaConfigContent hasStrava={hasStrava} /> : <UserInfoConfigContent userInfo={userInfo} />}
        <DialogActions>
          <Button onClick={handleSwitch}>
            {isStravaConfig ? 'User Config' : 'Strava Config'}
          </Button>
          <Button type="submit">
            {isStravaConfig ? (hasStrava ? 'Update or Sync' : 'Bind') : 'Save'}
          </Button>
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

const StravaConfigContent = ({ hasStrava }) => {
  return (
    <DialogContent>
      <DialogContentText>
        {hasStrava ?
          <p>Strava Configured. Leave Client ID and Client Secret empty to trigger data sync.</p> :
          <p>Strava Not Configured. Go to <Link href="https://www.strava.com/settings/api" target='_blank'>Strava Settings</Link> for Client ID and Client Secret.</p>}
      </DialogContentText>
      <TextField
        autoFocus
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

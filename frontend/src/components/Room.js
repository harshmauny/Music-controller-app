import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Button,
  Typography,
  Collapse,
  Alert,
  CircularProgress,
} from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";

export default function Room({ leaveRoomCallback }) {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const roomCode = useParams().roomCode;

  useEffect(() => {
    getRoomDetails();
  }, []);

  const getRoomDetails = async () => {
    try {
      const response = await fetch(`/api/get-room?code=${roomCode}`);
      if (!response.ok) {
        leaveRoomCallback();
        window.location.href = "/";
      }
      const data = await response.json();
      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
      if (data.is_host) {
        authenticateSpotify();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const authenticateSpotify = async () => {
    const response = await fetch("/spotify/is-authenticated/");
    const data = await response.json();
    setSpotifyAuthenticated(data.status);
    if (!data.status) {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch("/spotify/get-auth-url/", requestOptions);
      const json_resposne = await response.json();
      window.location.replace(json_resposne.url);
    }
  };

  const handleRoomLeave = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    await fetch("/api/leave-room/", requestOptions);
    leaveRoomCallback();
    window.location.href = "/";
  };

  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  const SettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const SettingsComponent = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          {console.log(successMsg)}
          <Collapse in={successMsg || errorMsg}>
            {successMsg ? (
              <Alert
                onClose={() => {
                  setSuccessMsg(false);
                }}
                severity="success"
              >
                Room updated successfully
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  setErrorMsg(false);
                }}
              >
                Error updating room
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
            setErrorMsg={setErrorMsg}
            setSuccessMsg={setSuccessMsg}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  return showSettings ? (
    <SettingsComponent />
  ) : loading ? (
    <CircularProgress />
  ) : (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" compact="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" compact="h6">
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" compact="h6">
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography variant="h6" compact="h6">
          Host: {isHost.toString()}
        </Typography>
      </Grid>
      {isHost ? <SettingsButton /> : null}
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={handleRoomLeave}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography, TextField } from "@mui/material";

export default function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value);
  };

  const joinRoom = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: roomCode,
      }),
    };
    try {
      const response = await fetch("/api/join-room/", requestOptions);
      if (response.ok) {
        window.location.href = "/room/" + roomCode;
      } else {
        setError("Room not found.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnterRoom = () => {
    joinRoom();
  };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Join a Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            error={error}
            label="Code"
            placeholder="Enter a Room Code"
            variant="outlined"
            value={roomCode}
            helperText={error}
            onChange={handleTextFieldChange}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" onClick={handleEnterRoom}>
            Enter Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormHelperText,
  TextField,
  FormControlLabel,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function CreateRoomPage(props) {
  const defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  };
  const [guestCanPause, setGuestCanPause] = useState(
    props.guestCanPause || defaultProps.guestCanPause
  );
  const [votesToSkip, setVotesToSkip] = useState(
    props.votesToSkip || defaultProps.votesToSkip
  );

  const handleVotesChange = (e) => {
    setVotesToSkip(Number(e.target.value));
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true" ? true : false);
  };

  const handleCreateButtonPressed = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    await fetch("/api/create-room/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.href = "/room/" + data.code;
      });
  };

  const handleUpdateButtonPressed = async () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.roomCode,
      }),
    };
    const response = await fetch("/api/update-room/", requestOptions);
    if (response.ok) {
      props.setSuccessMsg(true);
      console.log("Room updated successfully");
      props.updateCallback();
    } else {
      props.setErrorMsg(true);
    }
  };

  const title =
    props?.update || defaultProps.update ? "Update Room" : "Create A Room";
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={
              props.guestCanPause?.toString() || defaultProps.guestCanPause
            }
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            variant="outlined"
            onChange={handleVotesChange}
            value={votesToSkip}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Number of Votes Required to Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          onClick={
            props.update ? handleUpdateButtonPressed : handleCreateButtonPressed
          }
        >
          {props.update ? "Update Room" : "Create A Room"}
        </Button>
      </Grid>
      {!props.update && (
        <Grid item xs={12} align="center">
          <Button color="primary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

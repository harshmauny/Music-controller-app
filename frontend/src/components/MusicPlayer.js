import React from "react";
import {
  Button,
  Card,
  Grid,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

export default function MusicPlayer(props) {
  const { image_url, title, artist, is_playing, time, duration } = props;
  const songProgress = (time / duration) * 100;
  const playSong = async () => {
    await fetch("/spotify/play/", {
      method: "PUT",
      content: "application/json",
    });
  };
  const pauseSong = async () => {
    await fetch("/spotify/pause/", {
      method: "PUT",
      content: "application/json",
    });
  };
  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={image_url} height="100" width="100" />
        </Grid>
        <Grid item xs={8}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {artist}
          </Typography>
          <div>
            <IconButton
              onClick={() => {
                is_playing ? pauseSong() : playSong();
              }}
            >
              {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton>
              <SkipPreviousIcon />
            </IconButton>
            <IconButton>
              <SkipNextIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
}

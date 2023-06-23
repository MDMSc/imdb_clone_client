import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { MOVIE_API } from "../Global";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.loggedInUser);

  const getData = () => {
    setError("");
    setLoading(true);
    axios
      .get(`${MOVIE_API}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(`${error.response.data.message || error.message}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box
      sx={{
        padding: "2rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" sx={{ marginBottom: 1 }}>
          Movie List
        </Typography>

        {error !== "" ? (
          <Alert
            severity="error"
            onClose={() => {
              setError("");
            }}
            sx={{ width: 500 }}
          >
            {error}
          </Alert>
        ) : null}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 2 }}>
            <Typography variant="body2">
              Hi, <b>{loggedInUser !== null && loggedInUser.name}</b>
            </Typography>
            <Button
              size="small"
              variant="contained"
              color="error"
              sx={{ textTransform: "none" }}
              onClick={() =>
                dispatch({
                  type: "LOGOUT",
                })
              }
            >
              Logout
            </Button>
          </Box>
          <Button variant="contained" onClick={() => navigate("/add-movie")}>
            Add Movie
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          padding: "1rem",
        }}
      >
        {loading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : data !== null && data.length ? (
          data.map((val) => (
            <Card key={val._id} sx={{ width: 300 }}>
              <CardMedia
                sx={{
                  height: 160,
                  "&.MuiCardMedia-root": {
                    backgroundSize: "contain",
                  },
                }}
                image={val.poster}
                title={val.name}
                alt={val.name}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {val.name}
                </Typography>
                <Typography
                  gutterBottom
                  variant="caption"
                  component="div"
                  sx={{ marginBottom: 1 }}
                >
                  Year of Release: <b>{val.year_of_release}</b>
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    height: 20,
                  }}
                >
                  {val.plot}
                </Typography>

                <ul className="movie_data_list">
                  <li>
                    <Typography variant="body1">
                      <b>Producer:</b> {val.producer.name}
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      <b>Actors:</b>{" "}
                      {val.actors.map((actor, index) => {
                        if (index === val.actors.length - 1) {
                          return actor.name;
                        }
                        return `${actor.name}, `;
                      })}
                    </Typography>
                  </li>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate(`/edit-movie/${val._id}`)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography variant="body2">No data found</Typography>
        )}
      </Box>
    </Box>
  );
}

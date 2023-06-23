import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddForm from "./AddForm";
import axios from "axios";
import { ACTOR_API, MOVIE_API, PRODUCER_API } from "../Global";
import { useSelector } from "react-redux";

export default function MovieForm({
  type,
  _id,
  initialValues,
  validationSchema,
  errorMsg,
  setErrorMsg,
}) {
  const [actors, setActors] = useState([]);
  const [toggleActor, setToggleActor] = useState(false);
  const [toggleProducer, setToggleProducer] = useState(false);
  const [actorsList, setActorsList] = useState(null);
  const [producersList, setProducersList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [toggleList, setToggleList] = useState(true);
  const [addedActors, setAddedActors] = useState(null);

  const token = useSelector((state) => state.token);

  const handleToggleActor = () => setToggleActor(!toggleActor);
  const handleToggleProducer = () => setToggleProducer(!toggleProducer);
  const handleToggleList = () => setToggleList(!toggleList);

  const handleCreateMovie = (values) => {
    setError("");
    setSuccess("");
    setLoadingCreate(true);
    axios
      .post(`${MOVIE_API}/add-movie`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          setSuccess("Movie added successfully");
          setLoadingCreate(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(`${error.response.data.message || error.message}`);
        setLoadingCreate(false);
      });
  };

  const handleEditMovie = (values) => {
    setError("");
    setSuccess("");
    setLoadingCreate(true);
    axios
      .put(`${MOVIE_API}/edit-movie/${_id}`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          setSuccess("Movie edited successfully");
          setLoadingCreate(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(`${error.response.data.message || error.message}`);
        setLoadingCreate(false);
      });
  };

  const getActorsList = () => {
    setError("");
    setLoading(true);
    axios
      .get(`${ACTOR_API}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setActorsList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(`${error.response.data.message || error.message}`);
        setLoading(false);
      });
  };

  const getProducersList = () => {
    setError("");
    setLoading(true);
    axios
      .get(`${PRODUCER_API}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducersList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(`${error.response.data.message || error.message}`);
        setLoading(false);
      });
  };

  const handleErrorMessage = (error) => setError(error);
  const handleSuccessMessage = (success) => setSuccess(success);

  useEffect(() => {
    getActorsList();
    getProducersList();
  }, [toggleList]);

  useEffect(() => {
    if (
      type === "edit" &&
      actorsList !== null &&
      Object.keys(initialValues).length
    )
      setAddedActors(
        actorsList.filter((val) => initialValues.actors.includes(val._id))
      );
  }, [actorsList]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (actors.length) {
        values.actors = JSON.stringify(actors.map((actor) => actor._id));
      } else {
        values.actors = JSON.stringify(addedActors.map((actor) => actor._id));
      }

      if (type === "add") handleCreateMovie(values);
      if (type === "edit") handleEditMovie(values);
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
      }}
    >
      {success !== "" ? (
        <Alert
          severity="success"
          onClose={() => {
            setSuccess("");
          }}
          sx={{ width: 500 }}
        >
          {success}
        </Alert>
      ) : null}
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
      {errorMsg !== "" ? (
        <Alert
          severity="error"
          onClose={() => {
            setErrorMsg("");
          }}
          sx={{ width: 500 }}
        >
          {errorMsg}
        </Alert>
      ) : null}

      {type === "add" ? (
        <Typography variant="h3" sx={{ marginBottom: 3 }}>
          Add New Movie
        </Typography>
      ) : (
        <Typography variant="h3" sx={{ marginBottom: 3 }}>
          Edit Movie
        </Typography>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            width: 500,
            padding: 3,
            border: "1px solid black",
            borderRadius: "10px",
          }}
        >
          {/* Name */}
          <InputLabel required>Movie Name</InputLabel>
          <TextField
            name="name"
            placeholder="Enter Movie Name"
            {...formik.getFieldProps("name")}
            error={Boolean(formik.touched.name) && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            required
            fullWidth
            size="small"
            sx={{ marginBottom: 1 }}
          />

          {/* YOR */}
          <InputLabel required>Year of Release</InputLabel>
          <TextField
            name="year_of_release"
            placeholder="Enter Year of Release"
            {...formik.getFieldProps("year_of_release")}
            error={
              Boolean(formik.touched.year_of_release) &&
              Boolean(formik.errors.year_of_release)
            }
            helperText={
              formik.touched.year_of_release && formik.errors.year_of_release
            }
            required
            fullWidth
            size="small"
            sx={{ marginBottom: 1 }}
          />

          {/* Plot */}
          <InputLabel required>Plot</InputLabel>
          <TextField
            name="plot"
            placeholder="Enter Plot"
            {...formik.getFieldProps("plot")}
            error={Boolean(formik.touched.plot) && Boolean(formik.errors.plot)}
            helperText={formik.touched.plot && formik.errors.plot}
            required
            fullWidth
            size="small"
            sx={{ marginBottom: 1 }}
          />

          {/* Poster */}
          <InputLabel required>Poster</InputLabel>
          <TextField
            name="poster"
            placeholder="Enter Poster Url"
            {...formik.getFieldProps("poster")}
            error={
              Boolean(formik.touched.poster) && Boolean(formik.errors.poster)
            }
            helperText={formik.touched.poster && formik.errors.poster}
            required
            fullWidth
            size="small"
            sx={{ marginBottom: 1 }}
          />

          {/* Actors */}

          <InputLabel required>
            Actors{" "}
            {type === "edit" ? (
              <span>(Add the old actors again (if any))</span>
            ) : (
              ""
            )}
          </InputLabel>
          <Select
            name="actors"
            multiple
            value={actors}
            onChange={(e) =>
              setActors(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              )
            }
            input={<OutlinedInput />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value._id} label={value.name} />
                ))}
              </Box>
            )}
            sx={{ width: "100%", marginBottom: 1 }}
            size="small"
            error={
              Boolean(formik.touched.actors) && Boolean(formik.errors.actors)
            }
            required
          >
            {loading ? (
              <MenuItem value="loading" disabled>
                Loading...
              </MenuItem>
            ) : actorsList !== null && actorsList.length ? (
              actorsList.map((val) => (
                <MenuItem key={val._id} value={val}>
                  {val.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="loading" disabled>
                Actors' list is empty
              </MenuItem>
            )}
          </Select>
          {formik.touched.actors && formik.errors.actors ? (
            <p className="error">{formik.errors.actors}</p>
          ) : null}

          {type === "edit" && (
            <>
              Actors:
              <ul>
                {addedActors !== null &&
                  addedActors.length &&
                  addedActors.map((val) => {
                    return <li key={val._id}>{val.name}</li>;
                  })}
              </ul>
            </>
          )}

          {/* New Actor */}
          <Button
            size="small"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleToggleActor}
            sx={{
              marginBottom: 1,
            }}
          >
            New Actor
          </Button>
          <Box
            sx={{
              width: "100%",
              display: toggleActor ? "block" : "none",
            }}
          >
            <AddForm
              type="actor"
              handleToggle={handleToggleActor}
              handleErrorMessage={handleErrorMessage}
              handleSuccessMessage={handleSuccessMessage}
              handleToggleList={handleToggleList}
            />
          </Box>

          {/* Producer */}
          <InputLabel required>Producer</InputLabel>
          <Select
            name="producer"
            size="small"
            sx={{
              width: "100%",
            }}
            {...formik.getFieldProps("producer")}
            error={
              Boolean(formik.touched.producer) &&
              Boolean(formik.errors.producer)
            }
          >
            {loading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : producersList !== null && producersList.length ? (
              producersList.map((val) => (
                <MenuItem key={val._id} value={val._id}>
                  {val.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Producers' list is empty</MenuItem>
            )}
          </Select>
          {formik.touched.producer && formik.errors.producer ? (
            <p className="error">{formik.errors.producer}</p>
          ) : null}

          {/* New Producer */}
          <Button
            size="small"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleToggleProducer}
            sx={{
              marginBottom: 1,
            }}
          >
            New Producer
          </Button>
          <Box
            sx={{
              width: "100%",
              display: toggleProducer ? "block" : "none",
            }}
          >
            <AddForm
              type="producer"
              handleToggle={handleToggleProducer}
              handleErrorMessage={handleErrorMessage}
              handleSuccessMessage={handleSuccessMessage}
              handleToggleList={handleToggleList}
            />
          </Box>

          {type === "add" ? (
            <Button fullWidth variant="contained" type="submit" disabled={loadingCreate}>
              {loadingCreate ? <CircularProgress color="inherit" /> : <span>Create Movie</span>}
            </Button>
          ) : (
            <Button fullWidth variant="contained" type="submit" disabled={loadingCreate}>
              {loadingCreate ? <CircularProgress color="inherit" /> : <span>Edit Movie</span>}
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
}

import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";
import { ACTOR_API, PRODUCER_API } from "../Global";
import axios from "axios";
import { useSelector } from "react-redux";

const initialValues = {
  name: "",
  gender: "",
  dob: "",
  bio: "",
};

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name should have atleast 2 characters")
    .required("Required!!!"),
  gender: yup
    .string()
    .matches(/(M|F|O)/)
    .required("Required!!!"),
  dob: yup
    .date()
    .test("dob", "DOB must be less than current date", function (value) {
      return new Date(value) < new Date();
    })
    .required("Required!!!"),
  bio: yup.string().required("Required!!!"),
});

export default function AddForm({
  type,
  handleToggle,
  handleErrorMessage,
  handleSuccessMessage,
  handleToggleList,
}) {
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.token);

  const handleCreateActor = (values) => {
    setLoading(true);
    axios
      .post(`${ACTOR_API}/add-actor`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          handleSuccessMessage("Actor added successfully");
          setLoading(false);
          handleToggleList();
        }
      })
      .catch((error) => {
        console.log(error);
        handleErrorMessage(`${error.response.data.message || error.message}`);
        setLoading(false);
      });
  };

  const handleCreateProducer = (values) => {
    setLoading(true);
    axios
      .post(`${PRODUCER_API}/add-producer`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          handleSuccessMessage("Producer added successfully");
          setLoading(false);
          handleToggleList();
        }
      })
      .catch((error) => {
        console.log(error);
        handleErrorMessage(`${error.response.data.message || error.message}`);
        setLoading(false);
      });
  };

  const innerFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (type === "actor") handleCreateActor(values);
      if (type === "producer") handleCreateProducer(values);
      handleToggle();
    },
  });
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "60%",
        margin: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: 2,
          border: "1px solid black",
          borderRadius: "10px",
        }}
      >
        <InputLabel required>
          {type === "actor" ? <span>Actor</span> : <span>Producer</span>} Name
        </InputLabel>
        <TextField
          name="name"
          placeholder="Enter Name"
          {...innerFormik.getFieldProps("name")}
          error={
            Boolean(innerFormik.touched.name) &&
            Boolean(innerFormik.errors.name)
          }
          helperText={innerFormik.touched.name && innerFormik.errors.name}
          fullWidth
          size="small"
          sx={{ marginBottom: 1 }}
        />

        <InputLabel required>Gender</InputLabel>
        <Select
          name="gender"
          size="small"
          sx={{
            width: "100%",
          }}
          {...innerFormik.getFieldProps("gender")}
          error={
            Boolean(innerFormik.touched.gender) &&
            Boolean(innerFormik.errors.gender)
          }
        >
          <MenuItem value="M">Male</MenuItem>
          <MenuItem value="F">Female</MenuItem>
          <MenuItem value="O">Others</MenuItem>
        </Select>
        {innerFormik.touched.gender && innerFormik.errors.gender ? (
          <p className="error">{innerFormik.errors.gender}</p>
        ) : null}

        <InputLabel required>DOB</InputLabel>
        <TextField
          type="date"
          name="dob"
          placeholder="Enter DOB"
          {...innerFormik.getFieldProps("dob")}
          error={
            Boolean(innerFormik.touched.dob) && Boolean(innerFormik.errors.dob)
          }
          helperText={innerFormik.touched.dob && innerFormik.errors.dob}
          fullWidth
          size="small"
          sx={{ marginBottom: 1 }}
        />

        <InputLabel required>Bio</InputLabel>
        <TextField
          name="bio"
          placeholder="Enter Bio"
          {...innerFormik.getFieldProps("bio")}
          error={
            Boolean(innerFormik.touched.bio) && Boolean(innerFormik.errors.bio)
          }
          helperText={innerFormik.touched.bio && innerFormik.errors.bio}
          fullWidth
          size="small"
          sx={{ marginBottom: 1 }}
        />

        <Button
          variant="contained"
          onClick={innerFormik.handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              <span>Add New&nbsp;</span>
              {type === "actor" ? <span>Actor</span> : <span>Producer</span>}
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
}

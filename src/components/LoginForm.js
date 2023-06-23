import React, { useState } from "react";
import * as yup from "yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { USER_API } from "../Global";
import axios from "axios";
import { useDispatch } from "react-redux";

const loginInitialValues = {
  email: "",
  password: "",
};

const registerInitialValues = {
  name: "",
  email: "",
  password: "",
};

const loginValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid Email!!!").required("Required!!!"),
  password: yup
    .string()
    .min(5, "Password must have atleast 5 characters")
    .required("Required!!!"),
});

const registerValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name should have atleast 2 characters")
    .required("Required!!!"),
  email: yup.string().email("Invalid Email!!!").required("Required!!!"),
  password: yup
    .string()
    .min(5, "Password must have atleast 5 characters")
    .required("Required!!!"),
});

export default function LoginForm() {
  const [pageType, setPageType] = useState("login");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = (values) => {
    setError("");
    setSuccess("");
    setLoading(true);
    axios
      .post(`${USER_API}/login`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          dispatch({
            type: "LOGIN",
            payload: response.data,
          });

          getLoggedUser(response.data);
          setSuccess("Logged in successfully");
          setError("");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(`${error.response.data.message || error.message}`);
        setSuccess("");
        setLoading(false);
      });
  };

  const handleRegister = (values) => {
    setError("");
    setSuccess("");
    setLoading(true);
    axios
      .post(`${USER_API}/signup`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          setSuccess(response.data.message);
          setError("");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(`${error.response.data.message || error.message}`);
        setSuccess("");
        setLoading(false);
      });
  };

  const getLoggedUser = (data) => {
    setError("");
    axios
      .get(`${USER_API}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          dispatch({
            type: "LOGGED_USER",
            payload: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setError(`${error.response.data.message || error.message}`);
        setSuccess("");
      });
  };

  const formik = useFormik({
    initialValues:
      pageType === "login" ? loginInitialValues : registerInitialValues,
    validationSchema:
      pageType === "login" ? loginValidationSchema : registerValidationSchema,
    onSubmit: (values) => {
      if (pageType === "login") handleLogin(values);
      if (pageType === "register") handleRegister(values);
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

      <Typography variant="h3" sx={{ marginBottom: 3 }}>
        IMDB Clone
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            width: 500,
            padding: 3,
            border: "1px solid black",
            borderRadius: "10px",
          }}
        >
          {pageType === "register" && (
            <>
              <InputLabel required>Name</InputLabel>
              <TextField
                name="name"
                type="text"
                placeholder="Enter Name"
                {...formik.getFieldProps("name")}
                error={
                  Boolean(formik.touched.name) && Boolean(formik.errors.name)
                }
                helperText={formik.touched.name && formik.errors.name}
                required
                fullWidth
                size="small"
                sx={{ marginBottom: 1 }}
              />
            </>
          )}

          <InputLabel required>Email</InputLabel>
          <TextField
            name="email"
            type="email"
            placeholder="Enter Email"
            {...formik.getFieldProps("email")}
            error={
              Boolean(formik.touched.email) && Boolean(formik.errors.email)
            }
            helperText={formik.touched.email && formik.errors.email}
            required
            fullWidth
            size="small"
            sx={{ marginBottom: 1 }}
          />

          <InputLabel required>Password</InputLabel>
          <TextField
            name="password"
            type="password"
            placeholder="Enter Password"
            {...formik.getFieldProps("password")}
            error={
              Boolean(formik.touched.password) &&
              Boolean(formik.errors.password)
            }
            helperText={formik.touched.password && formik.errors.password}
            required
            fullWidth
            size="small"
            sx={{ marginBottom: 1 }}
          />

          {pageType === "login" ? (
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ marginBottom: 1 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="inherit" />
              ) : (
                <span>Login</span>
              )}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ marginBottom: 1 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="inherit" />
              ) : (
                <span>Register</span>
              )}
            </Button>
          )}

          <Typography
            color="primary"
            onClick={() => {
              setPageType(pageType === "login" ? "register" : "login");
            }}
            sx={{
              textDecoration: "underlined",
              "&:hover": {
                color: "violet",
                cursor: "pointer",
              },
            }}
          >
            {pageType === "login" ? "Register here" : "Back to Login"}
          </Typography>
        </Box>
      </form>
    </Box>
  );
}

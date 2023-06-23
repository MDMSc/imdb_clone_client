import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MOVIE_API } from "../Global";
import axios from "axios";
import * as yup from "yup";
import MovieForm from "./MovieForm";
import { useSelector } from "react-redux";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name should have atleast 2 characters")
    .required("Required!!!"),
  year_of_release: yup
    .number("Only digits")
    .integer("Cannot be a decimal")
    .positive("Year cannot be negative")
    .test(
      "year_of_release",
      "Year must have exactly 4 digits, greater than or equal to 1900 and less than or equal to 2999",
      (number) =>
        String(number).length === 4 && number >= 1900 && number <= 2999
    )
    .required("Required!!!"),
  plot: yup.string().required("Required!!!"),
  poster: yup
    .string()
    .url()
    .test("valid_url", "Please enter valid Image url", function (value) {
      return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(value);
    })
    .required("Required!!!"),
  actors: yup.array().required("Required!!!"),
  producer: yup.string().required("Required!!!"),
});

export default function FormComponent({ type }) {
  const { _id } = useParams();
  const [movieLoading, setMovieLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const token = useSelector(state => state.token);

  const getMovie = () => {
    setErrorMsg("");
    setMovieLoading(true);
    if (_id === undefined) {
      setErrorMsg("Movie id not found")
      return console.log("Movie id not found");
    }

    axios
      .get(`${MOVIE_API}/${_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          setInitialValues({
            name: response.data.name,
            year_of_release: response.data.year_of_release,
            plot: response.data.plot,
            poster: response.data.poster,
            actors: response.data.actors.map((a) => a._id),
            producer: response.data.producer._id,
          })
        }
        setMovieLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setErrorMsg(`${error.response.data.message || error.message}`);
        setMovieLoading(false);
      });
  };

  useEffect(() => {
    if (type === "edit") {
      getMovie();
    }
    if (type === "add") {
      setInitialValues({
        name: "",
        year_of_release: "",
        plot: "",
        poster: "",
        actors: [],
        producer: "",
      })
    }
  }, [type]);

  return (
    <>
      {!movieLoading && Object.keys(initialValues).length && (
        <MovieForm
          type={type}
          _id={_id}
          initialValues={initialValues}
          validationSchema={validationSchema}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      )}
    </>
  );
}

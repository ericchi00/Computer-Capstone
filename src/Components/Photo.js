import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Pie } from "react-chartjs-2";
import TrainingAccuracy from "../Assets/Figure_1.png";

const Photo = () => {
  const [cat, setCat] = useState();
  const [confidenceLevel, setConfidenceLevel] = useState();
  const [catImage, setCatImage] = useState(null);
  const [haveData, setHaveData] = useState(false);
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState({});
  const [link, setLink] = useState();

  const classNames = [
    "Abyssinian",
    "American Shorthair",
    "Bengal",
    "Birman",
    "Bombay",
    "British Shorthair",
    "Egyptian Mau",
    "Maine Coon",
    "Persian",
    "Ragdoll",
    "Russian Blue",
    "Scottish Fold",
    "Siamese",
    "Sphynx",
  ];

  useEffect(() => {
    getRandomImage();
  }, []);

  const getRandomImage = async () => {
    const imageAPI = await fetch(
      "https://api.thecatapi.com/v1/images/search?api_key=live_OqPa5Sbstd2cU7uq9BkMTmwvV6uCKxuGcekfuRHjqAtLHlMqGYhCYQFLAOyGyoH3&mime_types=jpg"
    );
    const response = await imageAPI.json();
    setCatImage(response[0].url);
    setCatBreedProbability(response[0].url);
  };

  const setCatBreedProbability = async (link) => {
    const headers = {
      mode: "cors",
      method: "POST",
      url: "https://catbreedpredictorapi.herokuapp.com/",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: link,
      }),
    };
    const url = await fetch(
      `https://catbreedpredictorapi.herokuapp.com/`,
      headers
    );
    const response = await url.json();
    const catBreed = Number(response[0]);
    setCat(classNames[catBreed]);
    const data = roundNumber(response[1]);
    const filteredData = [];
    const filteredLabels = [];
    for (let i = 0; i < classNames.length; i++) {
      if (data[i] !== 0) {
        filteredLabels.push(classNames[i]);
        filteredData.push(data[i]);
      }
    }
    setData(data);
    setConfidenceLevel(getMaxNumFromArray(filteredData));
    setFilteredData({
      labels: filteredLabels,
      datasets: [
        {
          label: "Cat Breed Probability",
          data: filteredData,
          backgroundColor: [
            "#0074D9",
            "#FF4136",
            "#2ECC40",
            "#FF851B",
            "#7FDBFF",
            "#B10DC9",
            "#FFDC00",
            "#001f3f",
            "#39CCCC",
            "#01FF70",
            "#85144b",
            "#F012BE",
            "#3D9970",
            "#111111",
            "#AAAAAA",
          ],
        },
      ],
    });
    setHaveData(true);
  };

  const getMaxNumFromArray = (arr) => {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
      max = Math.max(max, arr[i]);
    }
    return max;
  };

  const submitURL = () => {
    setCatImage(link);
    setCatBreedProbability(link);
    setHaveData(true);
  };

  const roundNumber = (arr) => {
    const data = arr;
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.round(data[i].toFixed(20) * 100);
    }
    return data;
  };

  return (
    <div className="container d-flex justify-content-center flex-column">
      <div className="d-flex justify-content-center mb-4 gap-4 align-items-center">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => {
            getRandomImage();
            setHaveData(!haveData);
          }}
        >
          Click to get a random cat image!
        </button>
        <div className="input-group-lg">
          <input
            className="form-control"
            id="catImageLink"
            type="text"
            placeholder="Put cat image URL link here"
            onChange={(e) => {
              setLink(e.target.value);
            }}
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={() => {
            submitURL();
            setHaveData(!haveData);
          }}
        >
          Submit cat link!
        </button>
      </div>
      <div className="container-fluid d-flex align-items-center justify-content-center gap-2 flex-column mb-5">
        {haveData === false ? (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <>
            <p className="fs-5">
              This cat is most likely a <strong>{cat}</strong> with a{" "}
              <strong>{confidenceLevel}</strong> percent confidence.
            </p>
            <div className="d-flex align-items-center">
              <img
                src={catImage}
                className="rounded img-fluid"
                alt="cat"
                style={{ maxHeight: "600px", maxWidth: "600px" }}
              />
              <Pie
                data={filteredData}
                options={{
                  animation: false,
                }}
                style={{ maxHeight: "400px", maxWidth: "400px" }}
              />
              <ul class="list-group list-group-numbered">
                {classNames.map((label, i) => {
                  return (
                    <li className="list-group-item" key={i}>
                      {label}: {data[i]}%
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
        {haveData === false ? (
          <></>
        ) : (
          <img src={TrainingAccuracy} alt="graph of training accuracy" />
        )}
      </div>
    </div>
  );
};

export default Photo;

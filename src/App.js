import "./App.css";
import Photo from "./Components/Photo";

const App = () => {
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center p-2 flex-column align-items-center">
        <p className="fs-1">Cat Breed Predictor</p>
        <p className="fs-6">It may take about one minute to load as the heroku dyno goes to sleep if there's no activity in 30 minutes.</p>
        <p className="fs-6">
          Cat URL must be in .jpg format to work. For more accurate results, the
          cat must be at least 80% focus of the photo with the entire body in
          the photo.
        </p>
      </div>
      <Photo />
    </div>
  );
};

export default App;

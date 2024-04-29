import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"; // CSS required for Components in React Bootstrap
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap"; // Componenets
import { useState, useEffect } from "react";
import axios from "axios";

// Spotify API Codes
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

const REDIRECT_URI = "http://localhost:3000/callback";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=playlist-modify-public`;

function authenticate() {
  window.location.href = AUTH_URL;
}

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Have a funciton run once when starting application
  useEffect(() => {
    // API Access Token
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);

    axios
      .post("https://accounts.spotify.com/api/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setAccessToken(response.data.access_token);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSearch = () => {
    axios
      .get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: searchInput,
          type: "track",
        },
      })
      .then((response) => {
        setSearchResults(response.data.tracks.items);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-5" size="lg">
          <FormControl
            placeholder="Search For Song"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                console.log("Enter button pressed!");
                handleSearch(); // Make sure this calls the handleSearch function
                event.preventDefault(); // Prevent the default action to avoid form submit
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          <Button onClick={handleSearch}>Search</Button>
        </InputGroup>
        <Container>
          <Row className="mx-2 row row-cols-4">
            {searchResults.map((song) => (
              <Card key={song.id}>
                <Card.Img src={song.album.images[0].url} />
                <Card.Body>
                  <Card.Title>{song.name}</Card.Title>
                </Card.Body>
              </Card>
            ))}
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default App;

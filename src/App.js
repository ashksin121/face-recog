import React, {useState, useEffect} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'cea33d661a504150af53a5b7c9da4d13'
 });

const particlesOptions = {  
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

function App() {

  const [input,setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    _id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  })

  // useEffect(() => {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log);
  // })

  const onInputChange = (event) => {
    // console.log(event.target.value);
    setInput(event.target.value);
  }

  const calculateFaceLoaction = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setBox(box);
  }

  const onButtonSubmit = () => {
    // console.log('ooops');
    setImageUrl(input);
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      input)
      .then( (response) => {
        // do something with response
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        displayFaceBox(calculateFaceLoaction(response));
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: user._id
            })
          })
          .then(response => response.json())
          .then(count => {
            setUser({
              ...user,
              entries: count
            })
          })
        }
      })
      .catch( (err) => {
        console.log(err);
      });
  }

  const onRouteChange = (rout) => {
    if(rout === 'signout') {
      setIsSignedIn(false);
    } else if(rout === 'home') {
      setIsSignedIn(true);
    }
    setRoute(rout);
  }

  return (
    <div className="App">
      <Particles className='particles' 
        params={particlesOptions}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      { route === 'home' ?
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm 
            onInputChange={onInputChange} 
            onButtonSubmit={onButtonSubmit} />
          <FaceRecognition imageUrl={imageUrl} box={box} />
        </div>
        : (
            route === 'signin' ?
            <Signin onRouteChange={onRouteChange} setUser={setUser} />
            : <Register onRouteChange={onRouteChange} setUser={setUser} />
        )
      }
    </div>
  );
}

export default App;

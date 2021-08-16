import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Facerecognition from './components/Facerecognition/Facerecognition';
import Register from './components/Register/Register';

const app = new Clarifai.App({
  apiKey: '0d5a7c2cba9c4ac3835706b12304c3be'
})

const particlesOptions = { 
  "particles": {
    "number": {
        "value": 200
    },
    "size": {
        "value": 2
    }
  }
}


class App extends Component {

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedin: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

    //console.log(width, height);
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
              .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
              .catch(err =>console.log(err));
        //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
     
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedin: false})
    } else if (route === 'home'){
      this.setState({isSignedin: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedin, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOptions}
        />
        <Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange} />        
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange}  
                onButtonSubmit={this.onButtonSubmit}/>
              <Facerecognition box={box} imageUrl={imageUrl} />
            </div>
          
          : (
            route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          )
          
          
           
        }
      </div>
    );
  }
}

export default App;

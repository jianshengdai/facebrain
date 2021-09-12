import React ,{ Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';

const app = new Clarifai.App({

  apiKey: '8757279ee2c047cabac58f8c7b93347e'

});

const particlesOptions = {
    particles: {
      number:{
        value:70,
        density:{
          enable:true,
          value_area:800
        }
      }
    }
  }

class App extends Component {
    constructor(){
      super();
      this.state = {
        input:'',
        imageUrl:'',
        boxes:[]
      }
    }

    calculateFaceLocation=(data)=>{

      const clarifaiFaces = data.outputs[0].data.regions.map(region=> region.region_info.bounding_box);
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);

    return clarifaiFaces.map(face =>{
      return{
        leftCol : face.left_col * width,
        topRow : face.top_row * height,
        rightCol : width - (face.right_col * width),
        bottomRow : height - (face.bottom_row * height)
      }
    });
  }

    displayFaceBox = (boxes) =>{
      this.setState({boxes:boxes});
    }


    onInputChange= (event) => {
      this.setState({input: event.target.value});
    }

    onButtonSubmit= () =>{

    this.setState({imageUrl:this.state.input})

      app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
        .then(response=>this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err));

    }

    render(){
      return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
              />
          <Navigation/>
          <Logo/>
          <Rank/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl}/>
      </div>
    );
    }
}

export default App;

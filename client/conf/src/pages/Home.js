//Importation de mes composants
import React,{Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './common/header';
import { Container,Row,Col,Button } from 'react-bootstrap';
import YouTube from '@u-wave/react-youtube';
import axios from "axios";


export default class Login extends Component{ 
  //Definition du constructeur
  constructor(){
    super()
    this.state = {
      etat: localStorage.getItem('logged'),
      idUser: localStorage.getItem('idUser'),
      messageInscrit: "Inscription à la conference"
    }
  }

  //lorsque j'arrive sur la page je fais un traitement
  //pour si je suis inscrit au conference
  async componentDidMount() {
    const newItem = ({ idUser : this.state.idUser, conf: "confNode"});
    //fix 
    var self = this;
    axios.post('http://localhost:5000/confInscrit', {}, {params: newItem}).then(function (response) {
      if(response.data === "ok"){
        //si je suis inscrit alors je change le text du button
        self.setState({messageInscrit: "Inscrit"})
      }else{
        //Sinon j'affiche le message de base
        self.setState({messageInscrit: "Inscription à la conference"})
      }
    });
  }


  verifConf = e => {
    e.preventDefault();
    if(this.state.etat === null){
      alert("Merci de vous connecter !");
      window.location.href = '/login'
    }else{
      window.location.href = '/conference'
    }
  }

  addConf = e => {
    e.preventDefault();
    if(this.state.etat === null){
      alert("Merci de vous connecter !");
      window.location.href = '/login'
    }else{
      var self = this;
      const newItem = { idUser : this.state.idUser, conf: "confNode"};
        axios.post('http://localhost:5000/conf', {}, {params: newItem}).then(function (response) {
          if(response.data === "ajout"){
            alert("Vous etes inscrit");
            self.setState({messageInscrit: "Inscrit"})
          }else{
            alert("Vous etes deja inscrit !");
          }
      });
    }
  }

  render(){
    return(
      <div className="App">
        <Navbar/>
        <br></br>
        <Container>
          <Row>
            <Col>
              <h1>React JS 5 HOURS</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <YouTube
                video="DLX62G4lc44"
                autoplay
                width="1000"
                height="500"
                controls="true"
                allowFullscreen="true"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" onClick={this.verifConf}>Rejoindre à la conférence</Button>
            </Col>
          </Row>
          <br></br>
          <br></br>
          <Row>
            <Col>
              <h1>NODE JS 1 HOUR</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <YouTube
                video="TlB_eWDSMt4"
                autoplay
                width="1000"
                height="500"
                controls="true"
                allowFullscreen="true"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" onClick={this.addConf}>{this.state.messageInscrit}</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <h1 style={{textAlign: "center"}}>A venir</h1>
            </Col>
          </Row>
          <br></br>
          <br></br>
        </Container>
      </div>
    );
  }
}
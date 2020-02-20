//Importation de mes composants
import React,{Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './common/header';
import { Container,Row,Col,Form,Button } from 'react-bootstrap';
import axios from "axios";

export default class Login extends Component{
  //Définition du constructeur
  constructor(){
    super();
    this.state={
      user: "",
      pass: ""
    }
  }

  //Lorsque la valeur change de l'user (input)
  changeUser = e => {
    this.setState({user: e.target.value})
  }

  //Lorsque la valeur change du pass (input)
  changePass = e => {
    this.setState({pass: e.target.value})
  }

  //j'envoie les données a l'api
  sendConnexion = e => {
    e.preventDefault();
    //Création de la variable de transfert
    const newItem = { user : this.state.user, pass: this.state.pass};
    //J'envoi les doonées
    axios.post('http://localhost:5000/login', {}, {params: newItem}).then(function (response) {

      //Je recupere les informations
      let test = response.data.split("#");

      if(test[0] === "connect"){
        //Si je peux recuperér 'connect'
        //alors je suis connecte
        //et je definis les variable local
        localStorage.setItem('logged', "1");
        localStorage.setItem('idUser', test[1]);
        localStorage.setItem('nomUser', test[2])
        //Et je redirige sur la page d'accueil
        window.location.href = '/'
      }else{
        //sinon j'affiche un message d'erreur
        alert("Probleme de connexion");
      }
    });
  }

  render(){
    return(
      <div className="App">
        <Navbar/>
        <br></br>
        <Container>
          <Row>
            <Col>
              <h1>Connexion</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form onSubmit={this.sendConnexion} method="POST">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Nom d'utilisateur</Form.Label>
                  <Form.Control type="text" placeholder="Votre nom d'utilisateur" onChange={this.changeUser} value={this.state.user}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control type="password" placeholder="Votre de mot de passe" onChange={this.changePass} value={this.state.pass}/>
                </Form.Group>
                <Button variant="success" type="submit">
                  Connexion
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
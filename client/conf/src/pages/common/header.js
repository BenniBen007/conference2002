//Importation de mes composants
import React,{Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar,Nav } from 'react-bootstrap';
import { Lock,Person,House,Info } from 'react-bootstrap-icons';

export default class header extends Component {

  constructor(){
    super()
    this.state = {
      etat: localStorage.getItem('logged'),
      nomUtilisateur: localStorage.getItem('nomUser')
    }
  }

  logout = e => {
    localStorage.removeItem('logged');
    localStorage.removeItem('idUser');
    localStorage.clear();
    window.location.href = '/login'
  }

    render(){
          return(
            <Navbar bg="light" expand="lg" shadow="sm">
            <Navbar.Brand href="/">Conference 2000</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {this.state.etat && (
                  <Navbar.Text>
                    <Info color="royalblue" size={32}/>Bonjour {this.state.nomUtilisateur}
                  </Navbar.Text>
                )}
                <Nav.Link href="/"><House color="royalblue" size={32}/>Accueil</Nav.Link>
                {!this.state.etat && (
                  <Nav.Link href="/login"><Person color="royalblue" size={32} />Connexion</Nav.Link>
                )}
                {this.state.etat && (
                  <Nav.Link href="" onClick={this.logout}><Lock color="royalblue" size={32} />Déconnexion</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          )
        
      }
}
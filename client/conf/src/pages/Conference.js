//Importation de mes composants
import React,{Component} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './common/header';
import { Container,Row,Col,Button,Form } from 'react-bootstrap';
import YouTube from '@u-wave/react-youtube';
import axios from "axios";
import socketIOClient from "socket.io-client";

export default class Conference extends Component{

    constructor(){
        super()
        this.state = {
            questionPrivate: "",
            userID: localStorage.getItem('idUser'),
            nomUtilisateur: localStorage.getItem('nomUser'),
            dateDebut: new Date(),
            response: false,
            endpoint: "http://localhost:5005",
            messages: [],
            message: ""
        }
        this.socket = socketIOClient('localhost:5005');
    
        this.socket.on('RECEIVE_MESSAGE', function(data){
            addMessage(data);
        });

        const addMessage = data => {
            console.log(data);
            this.setState({messages: [...this.state.messages, data]});
            console.log(this.state.messages);
        };
    }

    async componentDidMount(){
        if(localStorage.getItem('idUser') === null){
            window.location.href = '/login'
        }
    }

    changeQuestion = e => {
        this.setState({questionPrivate: e.target.value})
    }

    changeMessage = e => {
        this.setState({message: e.target.value})
    }

    sendPrivateQuestion = e => {
        e.preventDefault();
        const newItem = ({ idUser : this.state.userID, laQuestion: this.state.questionPrivate});
        
        axios.post('http://localhost:5000/questionPrive', {}, {params: newItem});

        alert('Question envoyé !');

        this.setState({
            questionPrivate: ""
        })
    }

    sendMessage = e => {
        e.preventDefault();
        this.socket.emit('SEND_MESSAGE', {
            auteur: this.state.nomUtilisateur,
            message: this.state.message
        })
        this.setState({message: ''});
    }


    quitterConference = e => {
        e.preventDefault();

        function dateDiff(date1, date2){
            var diff = {}                           // Initialisation du retour
            var tmp = date2 - date1;
         
            tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
            diff.sec = tmp % 60;                    // Extraction du nombre de secondes
         
            tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
            diff.min = tmp % 60;                    // Extraction du nombre de minutes
         
            tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
            diff.hour = tmp % 24;                   // Extraction du nombre d'heures
             
            tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
            diff.day = tmp;
             
            return diff;
        }


        let tempsFinal = dateDiff(this.state.dateDebut, new Date());

        let tempsAEnvoyer = "Jours : "+tempsFinal.day+" Heures : "+tempsFinal.hour+" Minutes : "+tempsFinal.min+" Secondes : "+tempsFinal.sec;
        
        const newItem = ({ idUser : this.state.userID, temps: tempsAEnvoyer});
        
        axios.post('http://localhost:5000/tempsUserConf', {}, {params: newItem});

        window.location.href = '/'
    }

  render(){
    return(
        <div className="App">
            <Navbar/>
            <br></br>
            <Container>
                <Row>
                    <Col>
                        <p>Envoyer un message au tchat</p>
                        <Form onSubmit={this.sendMessage} method="POST">
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Message</Form.Label>
                                <Form.Control type="text" placeholder="Votre message" onChange={this.changeMessage} value={this.state.message}/>
                            </Form.Group>
                            <Button variant="success" type="submit">
                                Envoyer 
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <YouTube
                            video="DLX62G4lc44"
                            width="500"
                            height="250"
                            controls="true"
                            allowFullscreen="true"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form onSubmit={this.sendPrivateQuestion} method="POST">
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Question privé</Form.Label>
                                <Form.Control type="text" placeholder="Votre questions privés" onChange={this.changeQuestion} value={this.state.questionPrivate}/>
                            </Form.Group>
                            <Button variant="success" type="submit">
                                Envoyer la question
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <br></br>
                <br></br>
                <Row>
                    <Col>
                        <p>Le tchat</p>
                        <div className="messages">
                            {this.state.messages.map(message => {
                                return (
                                    <div>{message.auteur} : {message.message}</div>
                                )
                            })}
                        </div>
                    </Col>
                </Row>
                <br></br>
                <br></br>
                <Row>
                    <Col>
                        <Button variant="primary" onClick={this.quitterConference}>Quitter</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
  }
}
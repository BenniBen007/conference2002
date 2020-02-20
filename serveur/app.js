//Appel de mes paquets
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require("socket.io");
const http = require("http");
//Connexion a la base mongo
mongoose.connect('mongodb://localhost:27017/conf');

//Déclaration des schemas
const userSchema = new mongoose.Schema({
    user: String,
    password: String
});

const confSchema = new mongoose.Schema({
    userID: String,
    conf: String
})

const questionSchema = new mongoose.Schema({
    userID: String,
    questions: String
})

const tempsConfSchema = new mongoose.Schema({
    userID: String,
    temps: String
})

//Définition des model
const userModel = mongoose.model('User', userSchema);
const confModel = mongoose.model('Conf', confSchema);
const questionModel = mongoose.model('Question', questionSchema);
const tempsModel = mongoose.model('Temps', tempsConfSchema);

//création du server express
const app = express();

//Configuration pour eviter/corriger les cross requetes ( CORS )
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//Affichage de hello world a la racine de l'api
app.get('/', (req,res) => {
    res.send('Hello world');
});

//Ce lien permet de configurer l'api lors de la premiere utilisation
app.get('/config', (req, res) => {
    userModel.find({user: "admin", password:"pass"}).remove().exec();
    userModel.find({user: "robert", password:"pass"}).remove().exec();
    userModel.find({user: "apple", password:"pass"}).remove().exec();

    const userDeBase = new userModel({
        user: "admin",
        password: "pass"
    });
    userDeBase.save();

    const userDeBase1 = new userModel({
        user: "robert",
        password: "pass"
    });
    userDeBase1.save();

    const userDeBase2 = new userModel({
        user: "apple",
        password: "pass"
    });
    userDeBase2.save();

    res.send("Configuré");
})

//Connexion 
app.post('/login', (req, res) => {
    
    userModel.findOne({ user: req.query.user, password: req.query.pass }, (err, usr) => {
        if(usr == null){
            res.send("null#0");
        }else{
            res.send("connect#"+usr._id+"#"+usr.user);
        }
    })
    
});

//Ajout d'une conference (inscription)
app.post('/conf', (req, res) => {

    confModel.findOne({userID: req.query.idUser, conf: req.query.conf}, (err, conf) => {
        if(conf == null){
            const confUser = new confModel({userID: req.query.idUser, conf: req.query.conf});

            confUser.save();

            res.send("ajout");
        }else{
            res.send("deja");
        }
    })
   
});


app.post('/confInscrit', (req, res) => {
    confModel.findOne({userID: req.query.idUser, conf: req.query.conf}, (err, conf) => {
        if(conf == null){
            res.send("rien");
        }else{
            res.send("ok");
        }
    });
})

//Ajout d'une question privée
app.post('/questionPrive', (req,res) => {
    const questionPrive = new questionModel({userID: req.query.idUser, questions: req.query.laQuestion});
    questionPrive.save();
})

//Ajout du temps pour la conference en fonction de l'utilisateur
app.post('/tempsUserConf', (req,res) => {
    const tempsEnvoiUser = new tempsModel({userID: req.query.idUser, temps: req.query.temps});
    tempsEnvoiUser.save();
})

//Je lance le serveur node
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Listening on port '+port));

//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//---------------------- SERVEUR IO SOCKET ---------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------


//Création du serveur de socket
const server = http.createServer(app);
const io = socketIo(server);

//J'ecoute 
io.on('connection', (socket) => {
    console.log(socket.id);
    //lorsque je recoi un message sur ce channel
    socket.on('SEND_MESSAGE', function(data){
        //Alors je renvoie sur un autre channel
        io.emit('RECEIVE_MESSAGE', data);
    })
});

//Et j'ecoute sur le port 5005
server.listen("5005", () => console.log(`Listening on port 5005`));
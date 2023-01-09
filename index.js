'use strict'

const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")
const app = express();
//database
connection
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

app.set('view engine', 'ejs');
//passou a aceitar arquivos estáticos
app.use(express.static('public'));
//Converte os valores que vem do front para uma string
app.use(bodyParser.urlencoded({extended: false}))
//Configuração body parser(pega as informações do front)
app.use(bodyParser.json());

app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order: [
        ['id', 'DESC']
    ]})
    .then(perguntas => {
        console.log(perguntas);
        res.render("index", {
            perguntas: perguntas
        })
    })
})

app.get("/perguntar", (req, res) => {
    res.render('perguntar')
})

app.get("/pergunta/:id",(req ,res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ // Pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[ 
                    ['id','DESC'] 
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        }else{ // Não encontrada
            res.redirect("/");
        }
    });
})


app.post("/responder/", (req, res)=>{ 
    const {questionAnswer,questionId} = req.body
    if(questionAnswer.length >= 3){
        Resposta.create({
            corpo: questionAnswer,
            perguntaId:questionId
        }).then(() => {
            res.redirect("/pergunta/"+questionId)
        }) 
    }else{
        res.redirect("/pergunta/"+questionId)
    }
})

app.post("/salvarPergunta", (req, res) => {
    const {pergunta} = req.body;
    const {descricao_pergunta} = req.body;
    Pergunta.create({
        titulo: pergunta,
        descricao: descricao_pergunta
    }).then(() => {
        res.redirect("/")
    })
})



app.listen(8080, console.log("Listening to port 8080"))
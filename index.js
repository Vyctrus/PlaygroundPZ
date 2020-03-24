const express = require('express');
const Joi =require('joi');
const app = express();

app.use(express.json());

const authors = [
    {id:1, name: 'author1'},
    {id:2, name: 'author2'},
    {id:3, name: 'author3'},
    {id:4, name: 'author4'},
];

app.get('/',(req,res) => {
     res.send('Hello World!!!');
});

app.get('/api/users', (req,res) => {
    res.send([1,2,3]);
});

app.get('/api/users/:id', (req,res) =>{
    res.send(req.params.id);
});

app.get('/api/authors', (req,res) =>{
    res.send(authors);
});

app.get('/api/authors/:id', (req,res) =>{
    const author = authors.find(c => c.id === parseInt(req.params.id));
    if(!author) return res.status(404).send('Author with the given id not found');// 404
    res.send(author);
});

app.post('/api/authors', (req,res) =>{
   
    const {error}= validateAuthor(req.body); //result.error <=> {error}
    if (error){
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const author ={
        id: authors.length + 1,
        name: req.body.name
    };
    authors.push(author);
    res.send(author);
});

//updating
app.put('/api/authors/:id', (req,res) =>{
    //look up author, not existing- then 404
    const author = authors.find(c => c.id === parseInt(req.params.id));
    if(!author) {
        res.status(404).send('Author with the given id not found');// 404
        return;  //<=> return res.status(404)....
    }
    //validate ?bad request?
    const schema ={
        name: Joi.string().min(3).required()
    };
    const result= Joi.validate(req.body, schema);
      // //validation example with joi



    //const result= validateAuthor(req.body);
    const {error}= validateAuthor(req.body); //result.error <=> {error}
    //if (result.error){
    if (error){
        //400 bad request
        res.status(400).send(result.error.details[0].message);
        return;
    }

    //update author
    author.name = req.body.name;

    res.send(author);
});


app.delete('/api/authors/:id', (req,res) =>{
    const author = authors.find(c => c.id === parseInt(req.params.id));
    if(!author) return res.status(404).send('Author with the given id not found');// 404

    const index = authors.indexOf(author);
    authors.splice(index, 1);

    res.send(author);
});

function validateAuthor(author){
    const schema ={
        name: Joi.string().min(3).required()
    };
    return Joi.validate(author, schema);
}


//PORT
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening at port ${port}`));

import express, {Request, Response} from "express";
import mongoose from "mongoose";
import Book from "./book.model";
import bodyParser from "body-parser";
import cors from "cors";

const app=express();
app.use(bodyParser.json());
app.use(cors());

const uri="mongodb://localhost:27017/BIBLIO2";
mongoose.connect(uri,(err)=>{
    if(err) console.log(err);
    else console.log("Mongo Data base connected successfuly");
});

app.get("/",(req:Request,resp:Response)=>{
    resp.send("Hello Express");
});

app.get("/books",(req:Request,resp:Response)=>{
   Book.find((err,books)=>{
       if(err) resp.status(500).send(err);
       else resp.send(books);
    });
});

app.get("/books/:id",(req:Request,resp:Response)=>{
    Book.findById(req.params.id,(err,book)=>{
        if(err) resp.status(500).send(err);
        else resp.send(book);
    });
});

app.post("/books",(req:Request,resp:Response)=>{
    let book =new Book(req.body);
    book.save(err=>{
        if(err) resp.status(500).send(err);
        else resp.send(book);
    })

});
app.put("/books/:id",(req:Request,resp:Response)=>{
    Book.findByIdAndUpdate(req.params.id,req.body,(err)=>{
        if(err) resp.status(500).send(err);
        else resp.send("Book updated succeslully");
    })

});
app.delete("/books/:id",(req:Request,resp:Response)=>{
    Book.findByIdAndDelete(req.params.id,(err)=>{
        if(err) resp.status(500).send(err);
        else resp.send("Book deleted succeslully");
    })

});
/*GET http://localhost:8085/pbooks?page=1&size=5*/
app.get("/pbooks",(req:Request,resp:Response)=>{
    let p:number=parseInt(req.query.page || 1);
    let size:number=parseInt(req.query.size || 5);
    Book.paginate({},{page:p, limit:size},(err,books)=>{
        if(err) resp.status(500).send(err);
        else resp.send(books);
    });
});

/*GET http://localhost:8085/books-search?kw=page=1&size=5*/
app.get("/books-search",(req:Request,resp:Response)=>{
    let p:number=parseInt(req.query.page || 1);
    let size:number=parseInt(req.query.size || 5);
    let kw:string=req.query.kw || "";
    Book.paginate({title:{$regex:".*(?i)"+kw+".*"}},{page:p, limit:size},(err,books)=>{
        if(err) resp.status(500).send(err);
        else resp.send(books);
    });
});

app.listen(8085,()=>{
    console.log("Serve started");
})
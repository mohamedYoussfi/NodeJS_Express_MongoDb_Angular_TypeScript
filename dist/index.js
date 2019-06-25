"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("./book.model"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(cors_1.default());
const uri = "mongodb://localhost:27017/BIBLIO2";
mongoose_1.default.connect(uri, (err) => {
    if (err)
        console.log(err);
    else
        console.log("Mongo Data base connected successfuly");
});
app.get("/", (req, resp) => {
    resp.send("Hello Express");
});
app.get("/books", (req, resp) => {
    book_model_1.default.find((err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.get("/books/:id", (req, resp) => {
    book_model_1.default.findById(req.params.id, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
app.post("/books", (req, resp) => {
    let book = new book_model_1.default(req.body);
    book.save(err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
app.put("/books/:id", (req, resp) => {
    book_model_1.default.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Book updated succeslully");
    });
});
app.delete("/books/:id", (req, resp) => {
    book_model_1.default.findByIdAndDelete(req.params.id, (err) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Book deleted succeslully");
    });
});
/*GET http://localhost:8085/pbooks?page=1&size=5*/
app.get("/pbooks", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let size = parseInt(req.query.size || 5);
    book_model_1.default.paginate({}, { page: p, limit: size }, (err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
/*GET http://localhost:8085/books-search?kw=page=1&size=5*/
app.get("/books-search", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let size = parseInt(req.query.size || 5);
    let kw = req.query.kw || "";
    book_model_1.default.paginate({ title: { $regex: ".*(?i)" + kw + ".*" } }, { page: p, limit: size }, (err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.listen(8085, () => {
    console.log("Serve started");
});

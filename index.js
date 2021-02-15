const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const mysql= require('mysql');
const bodyParser = require('body-parser');
const Handlebars = require('Handlebars');

const koneksi=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    passsword : '',
    database : 'db_toko'
});

// cek koneksi berhasil atau tidak
koneksi.connect((err)=>{
    if(err) throw err;
    console.log("Koneksi Berhasil");
});

// untuk memanggil css js adminlte
app.use(express.static(__dirname + '/views/layouts/adminlte/'));
// end

// Configure template Engine and Main File
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    // digunakan jika nama direktorinya custom
    // layoutsDir: __dirname + '/views/layouts/',
    // partialsDir: __dirname + '/views/bagianlayout/',
    // End
    helpers: require('./helper.js'),
}));

// Seting template Engine
app.set('view engine', 'hbs');
// routes

// Untuk Kirim data form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 

app.get('/', (req, res) => {
    res.render('home', {
        page_name: 'home',
        msg: false,
    });
});

app.get('/tipe-produk', (req, res) => {
    let gettipe="SELECT * FROM tipe_produk";
    let querygettipe=koneksi.query(gettipe, (err, results)=>{
        if (err) throw err;
        
        res.render('tipe-produk', {
            page_name: 'tipe-produk',
            results: results,
            msg: false,
        });
    });
});

app.post('/save-tipe-produk', (req, res)=>{
    let data = {tipe: req.body.tipe};
    let sql = "INSERT INTO tipe_produk SET ?";
    let query = koneksi.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/tipe-produk');
    });
});

app.post('/update-tipe', (req, res)=>{
    let updatetipe = "UPDATE tipe_produk SET tipe='"+req.body.tipe+"' WHERE id="+req.body.id;
    let query = koneksi.query(updatetipe, (err, results) => {
        if(err) throw err;
            res.redirect('/tipe-produk');
    });
});

app.post('/delete-tipe',(req, res) => {
    let sql = "DELETE FROM tipe_produk WHERE id='"+req.body.tipe_id+"' ";
    let query = koneksi.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/tipe-produk');
    });
});

// port nya bebas
app.listen(8888, () => {
    console.log('The web server has started on port 8888');
});
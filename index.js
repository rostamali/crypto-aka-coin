const express = require('express');
const app = express();
const port = process.env.PORT || 5000
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

/* ====== cors ====== */ 
const cors = require("cors");
app.use(cors());
app.use(express.json());

/* ====== image uploaded ====== */ 
const fileupload = require("express-fileupload");
app.use(fileupload());



/* mongoDB connect */
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kniae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log('Hit the DB');
})


/* Create API */ 
async function run() {
    try{
        await client.connect();
        const database = client.db('cryptoCoin');
        const heroCollection = database.collection('hero');
        const akacoinCollection = database.collection('akaCoin');
        const guidesCollection = database.collection('guides');
        const walletCollection = database.collection('wallet');
        const bannerCollection = database.collection('banner');

        /* ================= hero section API ================= */
        app.get('/get-hero', async(req, res)=>{
            const services = await heroCollection.findOne({});
            res.send(services)
        })
        app.put('/update-hero/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const services = await heroCollection.findOne({});
            
            let image = '';
            if(req.files){
                const pic = req.files.myFile;
                const picData = pic.data;
                const encodedPic = picData.toString('base64');
                image = Buffer.from(encodedPic, 'base64');
            }

            const result = await heroCollection.updateOne(query, {$set: { 

                subtitle : req.body.heroSubtitle ? req.body.heroSubtitle : services.subtitle,
                title : req.body.heroTitle ? req.body.heroTitle : services.title,
                description : req.body.heroDescription ? req.body.heroDescription : services.description,
                image: req.files ? image : services.image

            }});
            res.send(result)
        });


        /* ================= akacoin section ================= */ 
        app.get('/get-akacoin', async(req, res)=>{
            const services = await akacoinCollection.findOne({});
            res.send(services)
        })
        app.put('/update-akacoin/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const services = await akacoinCollection.findOne({});
            
            let image = '';
            if(req.files){
                const pic = req.files.myFile;
                const picData = pic.data;
                const encodedPic = picData.toString('base64');
                image = Buffer.from(encodedPic, 'base64');
            }

            const result = await akacoinCollection.updateOne(query, {$set: { 

                sectionTitle : req.body.akaCoinSectionTitle ? req.body.akaCoinSectionTitle : services.sectionTitle,
                title : req.body.akaCoinTitle ? req.body.akaCoinTitle : services.title,
                description : req.body.akaCoinDescription ? req.body.akaCoinDescription : services.description,
                image: req.files ? image : services.image

            }});
            res.send(result)
        });

        /* ================= guide section ================= */ 
        app.get('/get-guides', async(req, res)=>{
            const services = guidesCollection.find({});
            const result = await services.toArray();
            res.send(result)
        })
        app.put('/update-guide/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const services = await guidesCollection.findOne(query);

            let image = '';
            if(req.files){
                const pic = req.files.myFile;
                const picData = pic.data;
                const encodedPic = picData.toString('base64');
                image = Buffer.from(encodedPic, 'base64');
            }

            const result = await guidesCollection.updateOne(query, {$set: { 

                title : req.body.guideTitle ? req.body.guideTitle : services.title,
                description : req.body.guideDescription ? req.body.guideDescription : services.description,
                image: req.files ? image : services.image

            }});
            res.send(result)
        });


        /* ================= wallet section ================= */ 
        app.get('/get-wallet', async(req, res)=>{
            const services = walletCollection.find({});
            const result = await services.toArray();
            res.send(result)
        })

        app.put('/update-wallet/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const services = await walletCollection.findOne(query);

            let image = '';
            if(req.files){
                const pic = req.files.myFile;
                const picData = pic.data;
                const encodedPic = picData.toString('base64');
                image = Buffer.from(encodedPic, 'base64');
            }

            const result = await walletCollection.updateOne(query, {$set: { 

                title : req.body.walletTitle ? req.body.walletTitle : services.title,
                description : req.body.walletDescription ? req.body.walletDescription : services.description,
                image: req.files ? image : services.image

            }});

            res.send(result)
        });

        app.post('/new-wallet', async(req, res)=>{

            const pic = req.files.myFile;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const image = Buffer.from(encodedPic, 'base64');

            const doc = {
                title: req.body.walletTitle,
                description: req.body.walletTitle,
                backgroundColor: req.body.walletBg,
                image: image
            }
            const result = await walletCollection.insertOne(doc);

            res.send(result)
        })


        /* ================= banner section ================= */
        app.get('/get-banner', async(req, res)=>{
            const services = bannerCollection.find({});
            const result = await services.toArray();
            res.send(result)
        })
        app.put('/update-banner/:id', async (req, res)=>{
            
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const services = await bannerCollection.findOne(query);

            const result = await bannerCollection.updateOne(query, {$set: { 

                title : req.body.bannerTitle ? req.body.bannerTitle : services.title,
                description : req.body.bannerDescription ? req.body.bannerDescription : services.description

            }});
            res.send(result)
        });


    }finally{
        //await client.close();
    }
}
run().catch(console.dir);



/* check server connection */
app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}) 
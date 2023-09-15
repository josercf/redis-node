//Executar no CMD/powershell os comandos:
//criar o arquivo index.js
//npm init
//npm i express redis

const express = require("express");
const redis = require("redis");

const app = express();
const port = 3000;

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});


async function getProducts(req, res){
    const productId = req.params.id;
    const cacheResults = await redisClient.get(`fotos:produtos:${productId}`);
    res.json({ dados: cacheResults });
}

async function setProducts(req, res){
    const productId = req.params.id;
    const name = req.params.name;

    redisClient.set(`fotos:produtos:${productId}`, name);
   
    var todayEnd = new Date().setHours(23, 59, 59, 2023);
    redisClient.expireat(`fotos:produtos:${productId}`, parseInt(todayEnd/1000));

    res.json({ dados: cacheResults });
}

app.get("/produto/:id", getProducts);



app.get("/produto/:id/:name", setProducts);
  

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//alterar o arquivo docker-compose.yaml
//add na linha 7
/*
    ports:
    - "6379:6379"

*/
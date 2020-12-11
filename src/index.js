const { spawn, Pool, Worker } = require("threads")
const fetch = require('node-fetch');
const prompt = require('prompt-sync')();
const fs = require(`fs`);

const username = prompt('Введите имя пользователя для поиска: ');
fetch(`https://api.github.com/users/${username}/repos`)
.then(response => response.json())
.then(json => {
    if (json.length == 0) {
        return console.error(`Пользователь не найден или у пользователя нет репозиториев`);
    }
    else{
        try {
            fs.statSync(`repos/${username}`);
        }
        catch (err) {
          if (err.code === 'ENOENT') {
            fs.mkdirSync(`repos/${username}`);
          }
        }
        const queueSize = prompt('Введите количество Workers: ');
        var start = new Date().getTime();
        poolGen(json, username, queueSize);
    }
    var end = new Date().getTime();
    console.log(`SecondWay: ${end - start}ms`);
});

async function poolGen(json, username, queueSize) {
    const pool = Pool(() => spawn(new Worker("./workers/worker")), queueSize);
    
    json.forEach(repo => {
        pool.queue(async repoInfo => {
            const prop = await repoInfo(repo, username);
            console.log(prop);
        })
    });
    await pool.completed()
    await pool.terminate()
}
const { expose } = require("threads/worker")
const fs = require(`fs`);

async function repoInfo(repo, username) {
    const name = repo.name;
    let exposed = repo.url;
    fs.writeFile(`repos/${username}/${name}.json`, JSON.stringify(repo, null, 2), (err) => {
        if (err) {
            exposed = 'Writefile Error';
        }
    });
    return exposed;
}

expose(repoInfo)
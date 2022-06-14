const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
const github = require('@actions/github');

async function test2(){
  const context = github.context;
  if (context.payload.issue == null) {
      core.setFailed('No issue found.');
      return;
  }
  
  console.log(context.payload.issue.number)
  console.log(context.payload.issue.body)
  
// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
//const fetch = require('node-fetch');
const fetchP = import('node-fetch').then(mod => mod.default)
const fetch = (...args) => fetchP.then(fn => fn(...args))

const bodyData = `{
  "body": {
    "type": "doc",
    "version": 1,
    "content": [
      { "type": "paragraph",
        "content": [ { "text": "test reply2", "type": "text"} ]}
    ]
  }
}`;

fetch('https://my-atlassian-site-009117.atlassian.net/rest/api/3/issue/ZF-29/comment', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(
      'email@example.com:wWD5bmMAZeSJw90oQ3PV9319'
    ).toString('base64')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: bodyData
})
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`
    );
    return response.text();
  })
  .then(text => console.log(text))
  .catch(err => console.error(err));  
}
// test1();
test2()












async function test1(){

  const function1 = function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    console.log('files :'+files)
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
  }

  async function function2 (p) {
    let promise = new Promise(function(resolve, reject) {
        fs.readdir(p, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
    let result = await promise; 
    console.log(result); 
    return result
  };

  try{
    paths = []
    const input = core.getInput('input')
    // const output = core.getInput('output')

    paths.push(path.join(process.cwd(),''))
    paths.push(path.resolve('.'))

    // paths.push(path.join(process.cwd(),input))
    // paths.push(path.join(process.cwd(),output))

    // paths.push(path.resolve(input))
    // paths.push(path.resolve(output))


    const currentText = await fs.readFile(path.join(process.cwd(),'../aaa.txt'), "utf8");

    // for (let i = 0; i < paths.length; i++) {
    //   console.log(i+" : " +paths[i]) 
    //   console.log(fs.readdirSync(paths[i]))
    //   // function2(paths[i])
    //   //console.log(fs.readdirSync(paths[i]))
    // }

  }catch (error) {
    core.setFailed(error.message);
  }
}

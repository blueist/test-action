const core = require('@actions/core');
const fs = require('fs').promises;
const path = require('path');
const github = require('@actions/github');

const targetProject = "ZF" 
//const targetProject = "ZREQ"
const auth = 'bmkim@zinnotech.com:wMlye1tiVPz2y8DJgeZb5E33'
//const auth = 'bmkim@zinnotech.com:wWD5bmMAZeSJw90oQ3PV9319'


function getLinkToJira(){
  const context = github.context;
  if (context.payload.issue == null) {
      core.setFailed('No issue found.');
      return;
  }
  
  console.log("issue number is "+context.payload.issue.number)
  body = context.payload.issue.body
  s_idx = body.indexOf("ZF")
  if (s_idx < 0 ) {
      core.setFailed('No link(to jira) found.');
      return;
  }
  e_idx = body.indexOf("\n", s_idx)
  if (e_idx < 0 ) {
      core.setFailed('invalid link(to jira) found.');
      return;
  }
  linkto = body.substring(s_idx, e_idx-1)
  
  console.log(linkto+"("+s_idx+ ", " + e_idx+ ") from \n"+body)
  
  return linkto
}

async function replyToJira(linkto){
  const fetchP = import('node-fetch').then(mod => mod.default)
  const fetch = (...args) => fetchP.then(fn => fn(...args))

  const bodyData = `{
    "body": {
      "type": "doc",
      "version": 1,
      "content": [
        { "type": "paragraph",
          "content": [ { "text": "issue closed", "type": "text"} ]}
      ]
    }
  }`;

  url = 'https://my-atlassian-site-009117.atlassian.net/rest/api/3/issue/'+linkto+'/comment'
  console.log("url : "+url)
  fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(
      auth
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

linkto = getLinkToJira()
if (linkto != null) {
  replyToJira(linkto)
}  


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

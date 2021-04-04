var express = require('express');
var router = express.Router();
var path = require('path');
//const csv = require('csv-parser');
const fs = require('fs');
const readline = require('readline');
const bodyParser = require('body-parser');
const {exec} = require("child_process");

const userData = {
    headers: ["ID", "Jméno", "Přijímení"],
    rows: []
};

const attribFiles = {
    headers: ["Název"],
    rows: []
};

function loadUsers(userFile) {
    return new Promise((resolve, reject) => {
        try {
            const fileStream = fs.createReadStream(userFile).on('error', reject);
            const readInterface = readline.createInterface({
                input: fileStream,
                console: false
            }).on('line', function (line) {
                if (line !== '') {
                    let words = line.split(';').map(String);
                    userData.rows.push(words);
                }
            }).on('close', function () {
                resolve(userData);
            });
        } catch (e) {
            reject(e);
        }
    });
}

function loadAttributeFiles() {
    return new Promise((resolve, reject) => {
        try {
            const readDirectory = fs.readdir('./data/Issuer', function (err, files) {
                //handling error
                // if (err) {
                //     return console.log('Unable to scan directory: ' + err);
                // }
                //listing all files using forEach
                try{
                    files.forEach(function (file) {
                        if (file.indexOf('.att') >= 0) {
                            attribFiles.rows.push(file);
                        }
                    });
                    resolve(attribFiles);
                } catch (e) {
                    reject(e);
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

/* GET issuer page. */
router.get('/', function (req, res, next) {
    res.render('issuer');
});

// router.get('/login', function (req, res, next) {
//     res.redirect('../login');
// });

router.get('/users', function (req, res, next) {
    // loadUsers();
    res.render('issuer-users');
});

router.get('/attributes', function (req, res, next) {
    res.render('issuer-attributes');
});

router.get('/refreshUsers', async function (req, res) {
    userData.rows = [];
    await loadUsers('./data/Issuer/user_list.csv').then(function (data) {
        res.json({
            headers: data.headers,
            rows: data.rows
        })
    }).catch(err => {
        console.log('Error: ' + err);
    })
});

router.get('/refreshAttributes', async function (req, res) {
    attribFiles.rows = [];
    await loadAttributeFiles().then(function (data) {
        res.json({
            headers: data.headers,
            rows: data.rows
        })
    }).catch(err => {
        console.log('Error: ' + err);
    })
});

/* POST metods */

router.use(bodyParser.json());
router.post('/post-new-user', (req, res) => {
    console.log('Got body:', req.body.name, req.body.surname);
    var command = "./rkvac-protocol-multos-1.0.0 -p -n '" + req.body.name + "' -s '" + req.body.surname + "'";
    //var command = "touch /home/ondro/rkvac-temp/file1.txt";
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    res.sendStatus(200);
});

router.post('/post-new-attribute', (req, res) => {
    console.log('Got body:', req.body);
    var command = "printf '\\ny' | ./rkvac-protocol-multos-1.0.0 -i -a " + req.body.fileName;
    //var command = "touch /home/ondro/rkvac-temp/file1.txt";
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    res.sendStatus(200);
});

router.post('/post-new-EID', (req, res) => {
    console.log('Got body:', req.body);
    var command = "printf '1\\n" + req.body.EIDName + "\\n" + req.body.EIDBirthdate + "\\n" + req.body.EIDNationality + "\\n" + req.body.EIDAddress + "\\n" + req.body.EIDSex + "\\ny' | ./rkvac-protocol-multos-1.0.0 -i -a " + req.body.fileName;
    //var command = "touch /home/ondro/rkvac-temp/file1.txt";
    console.log(command);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    res.sendStatus(200);
});

router.post('/post-new-ticket', (req, res) => {
    console.log('Got body:', req.body);
    var command = "printf '2\\n" + req.body.ticketName + "\\n" + req.body.ticketNumber + "\\n" + req.body.ticketType + "\\ny' | ./rkvac-protocol-multos-1.0.0 -i -a " + req.body.fileName;
    //var command = "touch /home/ondro/rkvac-temp/file1.txt";
    console.log(command);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    res.sendStatus(200);
});

router.post('/post-new-card', (req, res) => {
    console.log('Got body:', req.body);
    var command = "printf '3\\n" + req.body.cardName + "\\n" + req.body.cardID + "\\n" + req.body.cardEmployer + "\\n" + req.body.cardPosition + "\\ny' | ./rkvac-protocol-multos-1.0.0 -i -a " + req.body.fileName;
    //var command = "touch /home/ondro/rkvac-temp/file1.txt";
    console.log(command);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    res.sendStatus(200);
});

router.post('/post-new-own', (req, res) => {
    console.log('Got body:', req.body);
    var command = "printf '4\\n" + req.body.attributeCount + "\\n";
    for (let i = 0; i < req.body.attributeCount; i++) {
        let attribName = 'own' + i;
        command += req.body[attribName];
        command += "\\n";
    }
    command += "y' | ./rkvac-protocol-multos-1.0.0 -i -a " + req.body.fileName;
    console.log(command);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    res.sendStatus(200);
});

// const crypto = require('crypto');
//
// const users = [
//     // This user is added to the array to avoid creating a new user on each restart
//     {
//         username: 'admin',
//         // This is the SHA256 hash for value of `password`
//         password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg='
//     }
// ];
//
// const authTokens = {};
//
// const getHashedPassword = (password) => {
//     const sha256 = crypto.createHash('sha256');
//     const hash = sha256.update(password).digest('base64');
//     return hash;
// }
//
// const generateAuthToken = () => {
//     return crypto.randomBytes(30).toString('hex');
// }
//
// router.get('/home', function(req, res, next) {
//     res.render('home');
// });
//
// router.post('/login', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const hashedPassword = getHashedPassword(password);
//
//     const user = users.find(u => {
//         return u.username === username && hashedPassword === u.password
//     });
//
//     if (user) {
//         const authToken = generateAuthToken();
//
//         // Store authentication token
//         authTokens[authToken] = user;
//
//         // Setting the auth token in cookies
//         res.cookie('AuthToken', authToken);
//
//         // Redirect user to the protected page
//         res.redirect(307,'/issuer/users');
//     } else {
//         res.render('home', {
//             message: 'Invalid username or password',
//             messageClass: 'alert-danger'
//         });
//     }
// });
module.exports = router;
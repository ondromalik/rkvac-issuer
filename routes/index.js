var express = require('express');
var router = express.Router();
var path = require('path');
//const csv = require('csv-parser');
const fs = require('fs');
const readline = require('readline');
const bodyParser = require('body-parser');
const {exec} = require("child_process");
const multer = require("multer");

var session = require('express-session');
var flash = require('connect-flash');
var auth = require('./auth.js');
const crypto = require('crypto');
const connectEnsureLogin = require('connect-ensure-login');

router.use(session({
    secret: 'some-secret',
    saveUninitialized: false,
    resave: true
}));

// For parsing post request's data/body
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// Tells app to use password session
router.use(auth.initialize());
router.use(auth.session());

router.use(flash());

/* Functions loading content to users and attributes tables */

const userData = {
    headers: ["ID", "First Name", "Last Name"],
    rows: []
};

const attribFiles = {
    headers: ["Name"],
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
                try {
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

/* Functions for upload ra_pk.dat */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data/Issuer/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname);
    }
});

const keyFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(dat)$/)) {
        req.fileValidationError = 'Only .dat files are allowed!';
        return cb(new Error('Only .dat files are allowed!'), false);
    }
    cb(null, true);
};

function logData(stdout, err, stderr) {
    let date = new Date();
    let dateFormat = date.getFullYear() + '/' + (date.getMonth() < 10 ? '0' : '') + date.getMonth() + '/' + (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ":" + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds() + ' ';
    if (err) {
        stdout += '\n' + 'error: ' + err;
    }
    if (stderr) {
        stdout += '\n' + 'stderr: ' + stderr;
    }
    fs.appendFile('./main.log', dateFormat + stdout + '\n', 'utf-8', (err) => {
        if (err) {
            console.log(err);
        }
    });
}

/* GET issuer page. */
router.get('/', connectEnsureLogin.ensureLoggedIn(), function (req, res, next) {
    res.render('index');
});

router.get('/login', function (req, res, next) {
    let message = JSON.stringify(req.flash('error'));
    if (message !== '[]') {
        let newMessage = message.replace('[', '').replace(']', '').replace('"', '').replace('"', '');
        res.render('login', {message: newMessage});
    } else {
        res.render('login');
    }
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/change-password', connectEnsureLogin.ensureLoggedIn(), function (req, res, next) {
    res.render('password-form');
});

router.get('/users', connectEnsureLogin.ensureLoggedIn(), function (req, res, next) {
    let message = JSON.stringify(req.flash('error'));
    res.render('issuer-users');
});

router.get('/attributes', connectEnsureLogin.ensureLoggedIn(), function (req, res, next) {
    res.render('issuer-attributes');
});

router.get('/refreshUsers', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
    userData.rows = [];
    loadUsers('./data/Issuer/user_list.csv').then(function (data) {
        res.json({
            headers: data.headers,
            rows: data.rows
        })
    }).catch(err => {
        console.log('Error: ' + err);
        res.json({
            error: true
        })
    })
});

router.get('/refreshAttributes', connectEnsureLogin.ensureLoggedIn(), function (req, res) {
    attribFiles.rows = [];
    loadAttributeFiles().then(function (data) {
        res.json({
            headers: data.headers,
            rows: data.rows
        })
    }).catch(err => {
        console.log('Error: ' + err);
        res.json({
            error: true
        })
    })
});

router.get('/downloadKey', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const file = './data/Issuer/ie_sk.dat';
    res.download(file);
});

router.get('/downloadLog', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const file = './main.log';
    res.download(file);
});

router.get('/deleteKey', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    fs.unlink('./data/Issuer/ra_pk.dat', (err) => {
        if (err) {
            console.error(err)
            return
        }
        logData('./data/Issuer/ra_pk.dat downloaded', err)
        res.json({success: true});
    })
});

router.get('/deleteIEKey', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    fs.unlink('./data/Issuer/ie_sk.dat', (err) => {
        if (err) {
            console.error(err)
            return
        }
        logData('./data/Issuer/ie_sk.dat deleted', err);
        res.json({success: true});
    })
});

router.get('/check-data', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    fs.access('./data', fs.F_OK, (err) => {
        if (err) {
            res.json({rkvac: false});
            return
        }
        res.json({rkvac: true});
    })
});

router.get('/check-keys', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    let response = {
        ieKey: false,
        raKey: false
    }
    fs.access('./data/Issuer/ie_sk.dat', fs.F_OK, (err) => {
        if (!err) {
            response.ieKey = true;
        }
        fs.access('./data/Issuer/ra_pk.dat', fs.F_OK, (err) => {
            if (!err) {
                response.raKey = true;
            }
            res.json({ieKey: response.ieKey, raKey: response.raKey});
        });
    });
});


/* POST metods */
router.post('/login',
    auth.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

let rkvacUsed = false;

router.use(bodyParser.json());
router.post('/post-new-user', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    if (!rkvacUsed) {
        rkvacUsed = true;
        console.log('Got body:', req.body.name, req.body.surname);
        var command = "./rkvac-protocol-multos-1.0.0 -p -n '" + req.body.name + "' -s '" + req.body.surname + "'";
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`stdout: ${stdout}`);
                console.log(`error: ${error.message}`);
                logData(stdout, error, stderr);
                res.json({success: false});
                rkvacUsed = false;
                return;
            }
            if (stderr) {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                logData(stdout, error, stderr);
                res.json({success: false});
                rkvacUsed = false;
                return;
            }
            logData(stdout, error, stderr);
            res.json({success: true});
            rkvacUsed = false;
            console.log(`stdout: ${stdout}`);
        });
    } else {
        res.json({rkvacUsed: true});
    }
});

router.post('/post-new-attribute', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    if (!rkvacUsed) {
        rkvacUsed = true;
        console.log('Got body:', req.body);
        var command = "printf '\\ny' | ./rkvac-protocol-multos-1.0.0 -i -a " + req.body.fileName;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`stdout: ${stdout}`);
                console.log(`error: ${error.message}`);
                logData(stdout, error, stderr);
                if (error.message.includes('cannot compute the user attributes signature!')) {
                    res.json({success: false, raMissing: true});
                } else {
                    res.json({success: false});
                }
                rkvacUsed = false;
                return;
            }
            if (stderr) {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                logData(stdout, error, stderr);
                res.json({success: false});
                rkvacUsed = false;
                return;
            }
            logData(stdout, error, stderr);
            res.json({success: true});
            rkvacUsed = false;
            console.log(`stdout: ${stdout}`);
        });
    } else {
        res.json({rkvacUsed: true});
    }
});

router.post('/post-new-EID', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    if (!rkvacUsed) {
        rkvacUsed = true;
        console.log('Got body:', req.body);
        var command = "printf '1\\n" + req.body.EIDName + "\\n" + req.body.EIDBirthdate + "\\n" + req.body.EIDNationality + "\\n" + req.body.EIDAddress + "\\n" + req.body.EIDSex + "\\ny' | ./rkvac-protocol-multos-1.0.0 -i -a " + req.body.fileName;
        //var command = "touch /home/ondro/rkvac-temp/file1.txt";
        console.log(command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`stdout: ${stdout}`);
                console.log(`error: ${error.message}`);
                logData(stdout, error, stderr);
                if (error.message.includes('cannot compute the user attributes signature!')) {
                    res.json({success: false, raMissing: true});
                } else {
                    res.json({success: false});
                }
                rkvacUsed = false;
                return;
            }
            if (stderr) {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                logData(stdout, error, stderr);
                res.json({success: false});
                rkvacUsed = false;
                return;
            }
            logData(stdout, error, stderr);
            res.json({success: true});
            rkvacUsed = false;
            console.log(`stdout: ${stdout}`);
        });
    } else {
        res.json({rkvacUsed: true});
    }
});

router.post('/post-new-ticket', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    if (!rkvacUsed) {
        rkvacUsed = true;
        console.log('Got body:', req.body);
        var command = "printf '2\\n" + req.body.ticketName + "\\n" + req.body.ticketNumber + "\\n" + req.body.ticketType + "\\ny' | ./rkvac-protocol-multos-1.0.0 -i -a " + req.body.fileName;
        //var command = "touch /home/ondro/rkvac-temp/file1.txt";
        console.log(command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`stdout: ${stdout}`);
                console.log(`error: ${error.message}`);
                logData(stdout, error, stderr);
                if (error.message.includes('cannot compute the user attributes signature!')) {
                    res.json({success: false, raMissing: true});
                } else {
                    res.json({success: false});
                }
                rkvacUsed = false;
                return;
            }
            if (stderr) {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                logData(stdout, error, stderr);
                res.json({success: false});
                rkvacUsed = false;
                return;
            }
            logData(stdout, error, stderr);
            res.json({success: true});
            rkvacUsed = false;
            console.log(`stdout: ${stdout}`);
        });
    } else {
        res.json({rkvacUsed: true});
    }
});

router.post('/post-new-card', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    if (!rkvacUsed) {
        rkvacUsed = true;
        console.log('Got body:', req.body);
        var command = "printf '3\\n" + req.body.cardName + "\\n" + req.body.cardID + "\\n" + req.body.cardEmployer + "\\n" + req.body.cardPosition + "\\ny' | ./rkvac-protocol-multos-1.0.0 -i -a " + req.body.fileName;
        //var command = "touch /home/ondro/rkvac-temp/file1.txt";
        console.log(command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`stdout: ${stdout}`);
                console.log(`error: ${error.message}`);
                logData(stdout, error, stderr);
                if (error.message.includes('cannot compute the user attributes signature!')) {
                    res.json({success: false, raMissing: true});
                } else {
                    res.json({success: false});
                }
                rkvacUsed = false;
                return;
            }
            if (stderr) {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                logData(stdout, error, stderr);
                res.json({success: false});
                rkvacUsed = false;
                return;
            }
            logData(stdout, error, stderr);
            res.json({success: true});
            rkvacUsed = false;
            console.log(`stdout: ${stdout}`);
        });
    } else {
        res.json({rkvacUsed: true});
    }
});

router.post('/post-new-own', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    if (!rkvacUsed) {
        rkvacUsed = true;
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
                if (error.message.includes('cannot compute the user attributes signature!')) {
                    res.json({success: false, raMissing: true});
                } else {
                    res.json({success: false});
                }
                rkvacUsed = false;
                console.log(`stdout: ${stdout}`);
                console.log(`error: ${error.message}`);
                logData(stdout, error, stderr);
                return;
            }
            if (stderr) {
                res.json({success: false});
                rkvacUsed = false;
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                logData(stdout, error, stderr);
                return;
            }
            logData(stdout, error, stderr);
            res.json({success: true});
            rkvacUsed = false;
            console.log(`stdout: ${stdout}`);
        });
    } else {
        res.json({rkvacUsed: true});
    }
});

router.post('/uploadKey', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({storage: storage, fileFilter: keyFilter}).single('ra_pk.dat');

    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send('Please select ".dat" file to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        logData("ra_pk.dat uploaded", err);
        res.redirect('/');
    });
});

router.post('/uploadIEKey', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({storage: storage, fileFilter: keyFilter}).single('ie_sk.dat');

    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send('Please select ".dat" file to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        logData("ie_sk.dat uploaded");
        res.redirect('/');
    });
});

router.post('/delete-attribute', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    fs.unlink('./data/Issuer/' + req.body.attributeName, (err) => {
        if (err) {
            console.log(err);
            res.json({success: false});
            return
        }
        logData("./data/Issuer/" + req.body.attributeName + " deleted", err);
        res.json({success: true});
    });
});

router.post('/show-attribute', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    let response = {
        names: [],
        attributes: []
    }
    const fileStream = fs.createReadStream('./data/Issuer/' + req.body.attributeName).on('error', () => {
        res.json({success: false});
    });
    readline.createInterface({
        input: fileStream,
        console: false
    }).on('line', function (line) {
        if (line !== '') {
            let words = line.split(';').map(String);
            response.names.push(words[0]);
            response.attributes.push(words[1]);
        }
    }).on('close', function () {
        res.json({success: true, names: response.names, attributes: response.attributes});
    });
});

router.post('/deleteData', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    fs.rmdir('./data', {recursive: true}, err => {
        if (err) {
            console.log(err);
            res.json({success: false});
            return;
        }
        logData("RKVAC reseted");
        res.json({success: true});
    });
});

// Change password
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(password).digest('base64');
}

router.post('/change-password', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    fs.readFile('./passwd', (err, data) => {
       if (err) {
           console.log(err);
           res.render('password-form', {message: "Request failed"});
           return;
       }
       if (data.toString() !== getHashedPassword(req.body.passwordOld)) {
           res.render('password-form', {message: "Incorrect old password"});
           return;
       }
       if (req.body.passwordNew !== req.body.passwordNew2) {
           res.render('password-form', {message: "New passwords don't match"});
           return;
       }
       fs.writeFile('./passwd', getHashedPassword(req.body.passwordNew), err1 => {
           if (err1) {
               console.log(err1);
               res.render('password-form', {message: "Request failed"});
               return;
           }
           res.render('password-form', {successMessage: "Password changed"});
       });
    });
});

module.exports = router;

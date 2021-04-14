{
    function checkRKVAC() {
        fetch('/check-data', {
            method: 'GET'
        }).then((response) => {
            response.json().then((data) => {
                if (data.rkvac) {
                    activateApp();
                    return;
                }
                throw new Error('Request failed');
            }).catch((error) => {
                console.log(error);
            });
        });
        fetch('/check-keys', {
            method: 'GET'
        }).then((response) => {
            response.json().then((data) => {
                if(data.ieKey) {
                    document.getElementById('downloadIEForm').hidden = false;
                    document.getElementById('uploadIEForm').hidden = true;
                }
                if(!data.ieKey) {
                    document.getElementById('downloadIEForm').hidden = true;
                    document.getElementById('uploadIEForm').hidden = false;
                }
                if(data.raKey) {
                    document.getElementById('uploadForm').hidden = true;
                    document.getElementById('deleteForm').hidden = false;
                    document.getElementById("attributePanel").className = document.getElementById("attributePanel").className.replace("w3-grey", "w3-blue-gray");
                    document.getElementById("attributeFooter").className = document.getElementById("attributeFooter").className.replace("w3-grey", "w3-blue-gray");
                }
                if(!data.raKey) {
                    document.getElementById('deleteForm').hidden = true;
                    document.getElementById('uploadForm').hidden = false;
                    document.getElementById("attributePanel").className = document.getElementById("attributePanel").className.replace("w3-blue-gray", "w3-gray");
                    document.getElementById("attributeFooter").className = document.getElementById("attributeFooter").className.replace("w3-blue-gray", "w3-gray");
                }
            }).catch((error) => {
                console.log(error);
            });
        });
        ListReaders();
    }

    document.getElementById('deleteKeyButton').addEventListener('click', () => {
        deleteKey();
    })

    document.getElementById('deleteIEButton').addEventListener('click', () => {
        fetch("/deleteIEKey", {
            method: 'GET'
        }).then((response) => {
            response.json().then((data) => {
                if (data.success) {
                    checkRKVAC();
                    return;
                }
                throw new Error('Request failed.');
            }).catch((error) => {
                console.log(error);
            });
        });
    })

    document.getElementById('resetRKVAC').addEventListener('click', () => {
        var really = confirm("Chystáte se vymazat veškerou RKVAC konfiguraci.\nPřejete si pokračovat?");
        if (really) {
            fetch("/deleteData", {
                method: 'POST'
            }).then((response) => {
                response.json().then((data) => {
                    if (data.success) {
                        location.reload();
                        return;
                    }
                    document.getElementById('resetMessage').hidden = false;
                    throw new Error('Request failed.');
                }).catch((error) => {
                    console.log(error);
                });
            });
        }
    });

    async function contactCard(hexdata) {
        var _readers = await navigator.webcard.readers();
        let atr = await _readers[0].connect(true);
        console.log("APDU request: " + hexdata);
        let res = await _readers[0].transcieve(hexdata);
        _readers[0].disconnect();
        return res;
    }

    async function ListReaders() {
        var reader_ul = document.getElementById('readerList');
        if (reader_ul.firstChild) {
            reader_ul.removeChild(reader_ul.firstChild);
        }
        var _readers = await navigator.webcard.readers();
        if (_readers[0]) {
            document.getElementById('cardStatus').hidden = true;
            document.getElementById('testCard').hidden = false;
            var reader = _readers[0];
            var node = document.createElement('li');
            reader_ul.append(node)
            node.outerHTML = `
      <div class="" tabindex="${0}">
              <span class="w3-center">
                <p style="font-weight: bold">${reader.name}</p>
                <p style="font-style: italic">${reader.atr === "" ? "Karta nevložená" : "Karta vložená"}</p>
              </span>
            </div>
      `;
        }
        else {
            document.getElementById('reloadMessage').hidden = false;
        }
    }

    function testReader() {
        contactCard('00A40400077675743231303100').then(res => {
            if (res === '9000') {
                document.getElementById("cardConnected").hidden = false;
                document.getElementById("cardDisconnected").hidden = true;
            }
            console.log("APDU response: " + res);
        }).catch(function (error) {
            document.getElementById("cardDisconnected").hidden = false;
            document.getElementById("cardConnected").hidden = true;
            console.log(error);
        });
    }

    window.onload = checkRKVAC;

    function activateApp() {
        document.getElementById('initiatingRKVAC').hidden = true;
        document.getElementById("keyPanel").className = document.getElementById("keyPanel").className.replace("w3-grey", "w3-cyan");
    }

    function deleteKey() {
        fetch("/deleteKey", {
            method: 'GET'
        }).then((response) => {
            response.json().then((data) => {
                if (data.success) {
                    checkRKVAC();
                    return;
                }
                throw new Error('Request failed.');
            }).catch((error) => {
                console.log(error);
            });
        });
    }

}
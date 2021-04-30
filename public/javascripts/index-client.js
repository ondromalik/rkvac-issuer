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
        var really = confirm("You are about to delete all RKVAC configuration\nDo you want to continue?");
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

    async function contactCard(index, hexdata) {
        var _readers = await navigator.webcard.readers();
        let atr = await _readers[index].connect(true);
        console.log("APDU request: " + hexdata);
        let res = await _readers[index].transcieve(hexdata);
        _readers[index].disconnect();
        return res;
    }

    async function ListReaders() {
        var reader_ul = document.getElementById('readerList');
        while (reader_ul.firstChild) {
            reader_ul.removeChild(reader_ul.firstChild);
        }
        var _readers = await navigator.webcard.readers();
        if (_readers[0]) {
            _readers.forEach((reader, index) => {
                var node = document.createElement('li');
                reader_ul.append(node)
                node.outerHTML = `
          <div class="" tabindex="${index}" onclick="testReader(${index})">
                  <span class="w3-center">
                    <label style="font-weight: bold">${reader.name}</label>
                    <label style="font-style: italic">(${reader.atr === "" ? "Card not inserted" : "Card inserted"})</label>
                  </span>
                </div>
          `;

            })
            document.getElementById('cardStatus').hidden = true;
        }
    }

    function testReader(index) {
        startLoader();
        contactCard(index, '00A40400077675743231303100').then(res => {
            hideLoader();
            if (res === '9000') {
                document.getElementById("cardConnected").hidden = false;
                document.getElementById("cardDisconnected").hidden = true;
            }
            else {
                document.getElementById("cardConnected").hidden = true;
                document.getElementById("cardDisconnected").hidden = false;
            }
            console.log("APDU response: " + res);
        }).catch(function (error) {
            hideLoader();
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

    function startLoader() {
        document.getElementById('login-loader').hidden = false;
    }

    function hideLoader() {
        document.getElementById('login-loader').hidden = true;
    }
}
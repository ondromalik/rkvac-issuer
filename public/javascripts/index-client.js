{
    function checkRKVAC() {
        fetch('/check-data', {
            method: 'GET'
        }).then(function(response) {
            if(response.ok) {
                console.log('RKVAC is ready');
                document.getElementById('initiatingRKVAC').hidden = true;
                return;
            }
            if(response.status === 404) {
                console.log('RKVAC is not ready');
                return;
            }
            throw new Error('Request failed.');
        }).catch(function(error) {
            console.log(error);
        });
        fetch('/check-ie-key', {
            method: 'GET'
        }).then(function(response) {
            if(response.ok) {
                document.getElementById('downloadKeyButton').disabled = false;
                return;
            }
            if(response.status === 404) {
                console.log('Issuer`s key not found');
                return;
            }
            throw new Error('Request failed.');
        }).catch(function(error) {
            console.log(error);
        });
        fetch('/check-ra-key', {
            method: 'GET'
        }).then(function(response) {
            if(response.ok) {
                console.log('File exists');
                document.getElementById('uploadForm').hidden = true;
                document.getElementById('deleteForm').hidden = false;
                return;
            }
            if(response.status === 404) {
                document.getElementById('deleteForm').hidden = true;
                document.getElementById('uploadForm').hidden = false;
                console.log('File not found');
                return;
            }
            throw new Error('Request failed.');
        }).catch(function(error) {
            console.log(error);
        });
        ListReaders();
    }

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
    }

    function testReader() {
        contactCard('00A4040000').then(res => {
            if (res === '9000') {
                document.getElementById("cardConnected").hidden = false;
            }
            console.log("APDU response: " + res);
        }).catch(function (error) {
            document.getElementById("cardDisconnected").hidden = false;
            console.log(error);
        });
    }

    // window.onbeforeunload = checkRA();
    window.onload = checkRKVAC;
}
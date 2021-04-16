{
    /**
     * Own attributes setting
     */

    function changeAttribForm(attribType, buttonID) {
        let attribForms = document.getElementsByClassName('poverenie');
        for (let i = 0; i < attribForms.length; i++) {
            attribForms[i].style.display = "none";
        }
        document.getElementById(attribType).style.display = "block";
        let attribButtons = document.getElementsByClassName('attribBtn');
        for (let i = 0; i < attribButtons.length; i++) {
            attribButtons[i].className = attribButtons[i].className.replace("w3-blue-gray", "");
        }
        document.getElementById(buttonID).className += " w3-blue-gray";
    }

    const attributeCount = document.getElementById('attributeCount');
    const ownAttributes = document.getElementById('ownAttributes');
    attributeCount.addEventListener('change', function () {
        let selectedValue = attributeCount.value;

        while (ownAttributes.firstChild) {
            ownAttributes.removeChild(ownAttributes.firstChild);
        }

        for (let i = 0; i < selectedValue; i++) {
            let label = document.createElement("label");
            label.innerHTML = "Název #" + (i + 1);
            // label.setAttribute("class", "labels");

            let input = document.createElement("input");
            input.setAttribute("class", "w3-input w3-border w3-round-medium w3-margin-bottom");
            let newID = toString(i);
            input.id = "own" + i;

            ownAttributes.appendChild(label);
            ownAttributes.appendChild(input);
        }
    });

}

{
    /**
     * Create new attribute
     */
    function messageOK() {
        document.getElementById('messageTabelOK').hidden = true;
        document.getElementById('messageTabelError').hidden = true;
        document.getElementById('messageOK').hidden = false;
        document.getElementById('messageError').hidden = true;
        document.getElementById('deleteAttributeOK').hidden = true;
        document.getElementById('deleteAttributeError').hidden = true;
    }

    function messageError() {
        document.getElementById('messageTabelOK').hidden = true;
        document.getElementById('messageTabelError').hidden = true;
        document.getElementById('messageOK').hidden = true;
        document.getElementById('messageError').hidden = false;
        document.getElementById('deleteAttributeOK').hidden = true;
        document.getElementById('deleteAttributeError').hidden = true;
    }

    document.getElementById('btnNewEID').addEventListener('click', function () {
        startLoader();
        document.getElementById('cardNotSelected').hidden = true;
        let tableRows = document.getElementsByClassName('cardSelector');
        let selectedCard = "";
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].checked) {
                selectedCard = tableRows[i];
            }
        }
        if (selectedCard === "") {
            document.getElementById('cardNotSelected').hidden = false;
            hideLoader();
            return;
        }
        let fileName = document.getElementById('attributeName').value;
        let EIDName = document.getElementById('EIDName').value;
        let EIDBirthdate = document.getElementById('EIDBirthdate').value;
        let EIDNationality = document.getElementById('EIDNationality').value;
        let EIDAddress = document.getElementById('EIDAddress').value;
        let EIDSex = document.getElementById('EIDSex').value;
        let newEID = {
            fileName: (fileName + '.att'),
            EIDName: EIDName,
            EIDBirthdate: EIDBirthdate,
            EIDNationality: EIDNationality,
            EIDAddress: EIDAddress,
            EIDSex: EIDSex
        };
        fetch('/post-new-EID', {
            method: 'POST',
            body: JSON.stringify(newEID),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            response.json().then((data) => {
                hideLoader();
                if (data.success) {
                    messageOK();
                    refreshTable();
                    return;
                }
                if (!data.success) {
                    messageError();
                    return;
                }
                throw new Error('Request failed.');
            }).catch(function (error) {
                hideLoader();
                console.log(error);
            });
        });
        connect(selectedCard.value);
        document.getElementById('attributeName').value = "";
        document.getElementById('EIDName').value = "";
        document.getElementById('EIDBirthdate').value = "";
        document.getElementById('EIDNationality').value = "";
        document.getElementById('EIDAddress').value = "";
        document.getElementById('EIDSex').value = "";
    });

    document.getElementById('btnNewTicket').addEventListener('click', function () {
        startLoader();
        document.getElementById('cardNotSelected').hidden = true;
        let tableRows = document.getElementsByClassName('cardSelector');
        let selectedCard = "";
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].checked) {
                selectedCard = tableRows[i];
            }
        }
        if (selectedCard === "") {
            document.getElementById('cardNotSelected').hidden = false;
            hideLoader();
            return;
        }
        let fileName = document.getElementById('attributeName').value;
        let ticketName = document.getElementById('ticketName').value;
        let ticketNumber = document.getElementById('ticketNumber').value;
        let ticketType = document.getElementById('ticketType').value;

        let newTicket = {
            fileName: (fileName + '.att'),
            ticketName: ticketName,
            ticketNumber: ticketNumber,
            ticketType: ticketType
        };
        fetch('/post-new-ticket', {
            method: 'POST',
            body: JSON.stringify(newTicket),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            response.json().then((data) => {
                hideLoader();
                if (data.success) {
                    messageOK();
                    refreshTable();
                    return;
                }
                if (!data.success) {
                    messageError();
                    return;
                }
                throw new Error('Request failed.');
            }).catch(function (error) {
                hideLoader();
                console.log(error);
            });
        });
        connect(selectedCard.value);
        document.getElementById('attributeName').value = "";
        document.getElementById('ticketName').value = "";
        document.getElementById('ticketNumber').value = "";
        document.getElementById('ticketType').value = "";
    });

    document.getElementById('btnNewCard').addEventListener('click', function () {
        startLoader();
        document.getElementById('cardNotSelected').hidden = true;
        let tableRows = document.getElementsByClassName('cardSelector');
        let selectedCard = "";
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].checked) {
                selectedCard = tableRows[i];
            }
        }
        if (selectedCard === "") {
            document.getElementById('cardNotSelected').hidden = false;
            hideLoader();
            return;
        }
        let fileName = document.getElementById('attributeName').value;
        let cardName = document.getElementById('cardName').value;
        let cardID = document.getElementById('cardID').value;
        let cardEmployer = document.getElementById('cardEmployer').value;
        let cardPosition = document.getElementById('cardPosition').value;
        let newCard = {
            fileName: (fileName + '.att'),
            cardName: cardName,
            cardID: cardID,
            cardEmployer: cardEmployer,
            cardPosition: cardPosition
        };
        fetch('/post-new-card', {
            method: 'POST',
            body: JSON.stringify(newCard),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            response.json().then((data) => {
                hideLoader();
                if (data.success) {
                    messageOK();
                    refreshTable();
                    return;
                }
                if (!data.success) {
                    messageError();
                    return;
                }
                throw new Error('Request failed.');
            }).catch(function (error) {
                hideLoader();
                console.log(error);
            });
        });
        connect(selectedCard.value);
        document.getElementById('attributeName').value = "";
        document.getElementById('cardName').value = "";
        document.getElementById('cardID').value = "";
        document.getElementById('cardEmployer').value = "";
        document.getElementById('cardPosition').value = "";
    });

    document.getElementById('btnNewOwn').addEventListener('click', function () {
        startLoader();
        document.getElementById('cardNotSelected').hidden = true;
        let tableRows = document.getElementsByClassName('cardSelector');
        let selectedCard = "";
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].checked) {
                selectedCard = tableRows[i];
            }
        }
        if (selectedCard === "") {
            document.getElementById('cardNotSelected').hidden = false;
            hideLoader();
            return;
        }
        let fileName = document.getElementById('attributeName').value;
        let attributeCount = document.getElementById('attributeCount').value;
        let newOwn = {
            fileName: (fileName + '.att'),
            attributeCount: attributeCount
        };
        for (let i = 0; i < attributeCount; i++) {
            let id = 'own' + i;
            let attribName = 'own' + i;
            newOwn[attribName] = document.getElementById(id).value;
            document.getElementById(id).value = "";
        }
        fetch('/post-new-own', {
            method: 'POST',
            body: JSON.stringify(newOwn),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            response.json().then((data) => {
                hideLoader();
                if (data.success) {
                    messageOK();
                    refreshTable();
                    return;
                }
                if (!data.success) {
                    messageError();
                    return;
                }
                throw new Error('Request failed.');
            }).catch(function (error) {
                hideLoader();
                console.log(error);
            });
        });
        connect(selectedCard.value);
        document.getElementById('attributeName').value = "";
    });

    async function refreshTable() {
        const root = document.querySelector(".attributeTable[data-url]");

        const table = root.querySelector(".table-attributeTable");
        const response = await fetch(root.dataset.url).catch(function (error) {
            console.log(error);
        });
        const attribFiles = await response.json();
        let date = new Date();
        let dateFormat = date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes() + ":" + (date.getSeconds()<10?'0':'') + date.getSeconds();
        document.getElementById('updatedDate').innerHTML = "Aktualizováno: " + dateFormat;
        if (attribFiles.error === true) {
            return;
        }

        //Clear table
        table.querySelector("thead tr").innerHTML = "";
        table.querySelector("tbody").innerHTML = "";

        //Populate headers
        for (const header of attribFiles.headers) {
            table.querySelector("thead tr").insertAdjacentHTML("beforeend", `
                <th>
                    ${header}
                </th>
                <th style="width: 25%"></th>
            `);
        }

        //Populate rows
        for (const row of attribFiles.rows) {
            table.querySelector("tbody").insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${row}</td>  
                    <td>
                        <div class="w3-bar">
                            <input class="w3-radio w3-bar-item attribSelector" type="radio" style="width:33%" name="attribSelect" value=${row}>
                            <i class="fas fa-info-circle w3-bar-item w3-button w3-hover-none" style="width:33%" onclick="showAttributeInfo('${row}')"></i>
                            <i class="fas fa-trash w3-bar-item w3-button w3-hover-none" style="width:33%"  onclick="deleteAttribute('${row}')"></i>
                        </div>
                    </td>          
                </tr>
            `);
        }
    }

    function deleteAttribute(attributeName) {
        let attribName = {
            attributeName: attributeName
        }
        fetch('/delete-attribute', {
            method: 'POST',
            body: JSON.stringify(attribName),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            response.json().then((data) => {
                if (data.success) {
                    document.getElementById('deleteAttributeOK').hidden = false;
                    document.getElementById('deleteAttributeError').hidden = true;
                    document.getElementById('messageTabelOK').hidden = true;
                    document.getElementById('messageTabelError').hidden = true;
                    document.getElementById('messageOK').hidden = true;
                    document.getElementById('messageError').hidden = true;
                    refreshTable();
                    return;
                }
                if (!data.success) {
                    document.getElementById('deleteAttributeOK').hidden = true;
                    document.getElementById('deleteAttributeError').hidden = false;
                    document.getElementById('messageTabelOK').hidden = true;
                    document.getElementById('messageTabelError').hidden = true;
                    document.getElementById('messageOK').hidden = true;
                    document.getElementById('messageError').hidden = true;
                    return;
                }
                throw new Error('Request failed.');
            }).catch(function (error) {
                console.log(error);
            });
        })
    }

    function showAttributeInfo(attributeName) {
        let attribName = {
            attributeName: attributeName
        }
        fetch('/show-attribute', {
            method: 'POST',
            body: JSON.stringify(attribName),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            response.json().then((data) => {
                if (data.success) {
                    let list = document.getElementById('attributeList');
                    while (list.firstChild) {
                        list.removeChild(list.firstChild);
                    }
                    let header = list.createTHead();
                    let row = header.insertRow(0);
                    let th1 = document.createElement('th');
                    let th2 = document.createElement('th');
                    th1.innerHTML = "Název";
                    th2.innerHTML = "Hodnota";
                    row.appendChild(th1);
                    row.appendChild(th2);

                    for (let i = 0; i < data.names.length; i++) {
                        let row = list.insertRow(i+1);
                        let cell1 = row.insertCell(0);
                        let cell2 = row.insertCell(1);
                        cell1.innerHTML = data.names[i] + ":";
                        cell2.innerHTML = data.attributes[i];
                    }
                    document.getElementById('attributeInfo').style.display = 'block';
                    return;
                }
                if (!data.success) {
                    return;
                }
                throw new Error('Request failed.');
            }).catch(function (error) {
                console.log(error);
            });
        })
    }

    document.getElementById('btnRefreshAttributes').addEventListener('click', function (e) {
        document.getElementById('btnRefreshAttributes').className += " table-refresh__button--refreshing";
        refreshTable().then(() => {
            document.getElementById('btnRefreshAttributes').className = document.getElementById('btnRefreshAttributes').className.replace(" table-refresh__button--refreshing", "");
        });
    })

    document.getElementById('btnAssignAttributes').addEventListener('click', function () {
        startLoader2();
        document.getElementById('cardNotSelected2').hidden = true;
        let cardRows = document.getElementsByClassName('cardSelector2');
        let selectedCard = "";
        for (let i = 0; i < cardRows.length; i++) {
            if (cardRows[i].checked) {
                selectedCard = cardRows[i];
            }
        }
        if (selectedCard === "") {
            document.getElementById('cardNotSelected2').hidden = false;
            hideLoader2();
            return;
        }
        let tableRows = document.getElementsByClassName('attribSelector');
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].checked) {
                let selectedFile = {
                    fileName: tableRows[i].value
                };
                fetch('/post-new-attribute', {
                    method: 'POST',
                    body: JSON.stringify(selectedFile),
                    headers: {'Content-Type': 'application/json'}
                }).then(function (response) {
                    response.json().then((data) => {
                        hideLoader2();
                        if (data.success) {
                            document.getElementById('messageTabelOK').hidden = false;
                            document.getElementById('messageTabelError').hidden = true;
                            document.getElementById('messageOK').hidden = true;
                            document.getElementById('messageError').hidden = true;
                            document.getElementById('deleteAttributeOK').hidden = true;
                            document.getElementById('deleteAttributeError').hidden = true;
                            return;
                        }
                        if (!data.success) {
                            document.getElementById('messageTabelOK').hidden = true;
                            document.getElementById('messageTabelError').hidden = false;
                            document.getElementById('messageOK').hidden = true;
                            document.getElementById('messageError').hidden = true;
                            document.getElementById('deleteAttributeOK').hidden = true;
                            document.getElementById('deleteAttributeError').hidden = true;
                            return;
                        }
                        throw new Error('Request failed.');
                    }).catch(function (error) {
                        hideLoader2();
                        console.log(error);
                    });
                })
                connect(selectedCard.value);
            }
        }
        hideLoader2();
    })

    function startLoader() {
        document.getElementById('login-loader').hidden = false;
    }

    function hideLoader() {
        document.getElementById('login-loader').hidden = true;
    }

    function startLoader2() {
        document.getElementById('login-loader-2').hidden = false;
    }

    function hideLoader2() {
        document.getElementById('login-loader-2').hidden = true;
    }

    async function ListReaders() {
        var reader_ul = document.getElementById('readerList');
        var reader_ul2 = document.getElementById('readerList2');
        while (reader_ul.firstChild) {
            reader_ul.removeChild(reader_ul.firstChild);
            reader_ul2.removeChild(reader_ul2.firstChild);
        }
        var _readers = await navigator.webcard.readers();
        if (_readers[0]) {
            document.getElementById('cardError').hidden = true;
            document.getElementById('cardError2').hidden = true;
            _readers.forEach((reader, index) => {
                var node = document.createElement('li');
                var node2 = document.createElement('li');
                reader_ul.append(node);
                reader_ul2.append(node2);
                node.outerHTML = `
            <input type="radio" class="w3-radio w3-bar-item cardSelector" name="cardIndex" value="${index}">
                ${reader.name}
            </input>
          `;
                node2.outerHTML = `
            <input type="radio" class="w3-radio w3-bar-item cardSelector2" name="cardIndex" value="${index}">
                ${reader.name}
            </input>
          `;
            })
        }
    }

    function onLoad() {
        refreshTable();
        ListReaders();
    }

    window.onload = onLoad;

    window.onclick = function (event) {
        let modal = document.getElementById('attributeInfo');
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

}

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
        document.getElementById('message').hidden = false;
        document.getElementById('message').innerHTML = 'Pověření vytvořené a vydané na kartu';
        document.getElementById('message').className = document.getElementById('message').className.replace('w3-text-red', '');
        document.getElementById('message').className = document.getElementById('message').className.replace('w3-text-green', '');
        document.getElementById('message').className += " w3-text-green";
    }

    function messageError() {
        document.getElementById('message').hidden = false;
        document.getElementById('message').innerHTML = 'Požadavek nebyl úspěšný';
        document.getElementById('message').className = document.getElementById('message').className.replace('w3-text-green', '');
        document.getElementById('message').className = document.getElementById('message').className.replace('w3-text-red', '');
        document.getElementById('message').className += " w3-text-red";
    }

    const btnNewEID = document.getElementById('btnNewEID');
    btnNewEID.addEventListener('click', function () {
        console.log('Client-side OK');
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

        console.log(newEID);

        fetch('/post-new-EID', {
            method: 'POST',
            body: JSON.stringify(newEID),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            if (response.ok) {
                messageOK();
                return;
            }
            if(response.status === 503) {
                messageError();
                return;
            }
            throw new Error('Request failed.');
        }).catch(function (error) {
            console.log(error);
        });
        connect();

        document.getElementById('attributeName').value = "";
        document.getElementById('EIDName').value = "";
        document.getElementById('EIDBirthdate').value = "";
        document.getElementById('EIDNationality').value = "";
        document.getElementById('EIDAddress').value = "";
        document.getElementById('EIDSex').value = "";
    });

    const btnNewTicket = document.getElementById('btnNewTicket');
    btnNewTicket.addEventListener('click', function () {
        console.log('Client-side OK');
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

        console.log(newTicket);

        fetch('/post-new-ticket', {
            method: 'POST',
            body: JSON.stringify(newTicket),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            if (response.ok) {
                messageOK();
                return;
            }
            if(response.status === 503) {
                messageError();
                return;
            }
            throw new Error('Request failed.');
        }).catch(function (error) {
            console.log(error);
        });
        connect();

        document.getElementById('attributeName').value = "";
        document.getElementById('ticketName').value = "";
        document.getElementById('ticketNumber').value = "";
        document.getElementById('ticketType').value = "";
    });

    const btnNewCard = document.getElementById('btnNewCard');
    btnNewCard.addEventListener('click', function () {
        console.log('Client-side OK');
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

        console.log(newCard);

        fetch('/post-new-card', {
            method: 'POST',
            body: JSON.stringify(newCard),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            if (response.ok) {
                messageOK();
                return;
            }
            if(response.status === 503) {
                messageError();
                return;
            }
            throw new Error('Request failed.');
        }).catch(function (error) {
            console.log(error);
        });
        connect();

        document.getElementById('attributeName').value = "";
        document.getElementById('cardName').value = "";
        document.getElementById('cardID').value = "";
        document.getElementById('cardEmployer').value = "";
        document.getElementById('cardPosition').value = "";
    });

    const btnNewOwn = document.getElementById('btnNewOwn');
    btnNewOwn.addEventListener('click', function () {
        console.log('Client-side OK');
        let fileName = document.getElementById('attributeName').value;
        let attributeCount = document.getElementById('attributeCount').value;

        let newOwn = {
            fileName: (fileName + '.att'),
            attributeCount: attributeCount
        };

        for (let i = 0; i < attributeCount; i++) {
            let id = 'own' + i;
            let attribName = 'own' + i;
            let own = document.getElementById(id).value;
            newOwn[attribName] = own;
            document.getElementById(id).value = "";
        }

        console.log(newOwn);

        fetch('/post-new-own', {
            method: 'POST',
            body: JSON.stringify(newOwn),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
            if (response.ok) {
                messageOK();
                return;
            }
            if(response.status === 503) {
                messageError();
                return;
            }
            throw new Error('Request failed.');
        }).catch(function (error) {
            console.log(error);
        });
        connect();

        document.getElementById('attributeName').value = "";

    });

}

{
    /**
     * Populates attribute table with attribute files
     *
     */

    async function refreshTable(root) {
        console.log("Table refreshed!");

        const table = root.querySelector(".table-attributeTable");
        const response = await fetch(root.dataset.url)
        const attribFiles = await response.json()

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
                            <i class="fas fa-info-circle w3-bar-item w3-button w3-hover-none" style="width:33%"></i>
                            <i class="fas fa-trash w3-bar-item w3-button w3-hover-none" style="width:33%"></i>
                        </div>
                    </td>          
                </tr>
            `);
        }

        // console.log(attribFiles);

    }

    for (const root of document.querySelectorAll(".attributeTable[data-url]")) {
        const btnRefreshAttributes = document.getElementById('btnRefreshAttributes');
        const table = document.createElement("table");
        table.classList.add("w3-table-all");
        table.classList.add("w3-gray");
        table.classList.add("table-attributeTable");

        table.innerHTML = `
            <thead>
                <tr class="w3-light-gray"></tr>
            </thead>
            <tbody>
                <tr>
                    <td>Načítavam</td>
                </tr>
            </tbody>
        `;

        root.append(table);

        btnRefreshAttributes.addEventListener('click', function (e) {
            console.log('Button clicked!');
            refreshTable(root);
        })

        refreshTable(root);
    }

    const btnAssignAttributes = document.getElementById('btnAssignAttributes');
    btnAssignAttributes.addEventListener('click', function () {
        let tableRows = document.getElementsByClassName('attribSelector');
        for (let i = 0; i < tableRows.length; i++) {
            if (tableRows[i].checked) {
                let selectedFile = {
                    fileName: tableRows[i].value
                };
                fetch('/post-new-attribute', {
                    method: 'POST',
                    body: JSON.stringify(selectedFile),
                    headers: { 'Content-Type': 'application/json'}
                }).then(function(response) {
                    if(response.ok) {
                        document.getElementById('messageTable').hidden = false;
                        document.getElementById('messageTable').innerHTML = 'Pověření vytvořené a vydané na kartu';
                        document.getElementById('messageTable').className = document.getElementById('messageTable').className.replace('w3-text-green', '');
                        document.getElementById('messageTable').className = document.getElementById('messageTable').className.replace('w3-text-red', '');
                        document.getElementById('messageTable').className += " w3-text-green";
                        return;
                    }
                    if(response.status === 503) {
                        document.getElementById('messageTable').hidden = false;
                        document.getElementById('messageTable').innerHTML = 'Požadavek nebyl úspěšný';
                        document.getElementById('messageTable').className = document.getElementById('messageTable').className.replace('w3-text-green', '');
                        document.getElementById('messageTable').className = document.getElementById('messageTable').className.replace('w3-text-red', '');
                        document.getElementById('messageTable').className += " w3-text-red";
                        return;
                    }
                    throw new Error('Request failed.');
                }).catch(function(error) {
                        console.log(error);
                    });
                connect();
            }
        }
    })

}

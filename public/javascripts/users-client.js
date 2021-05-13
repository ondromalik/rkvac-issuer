{

    const btnNewUser = document.getElementById('btnNewUser');
    btnNewUser.addEventListener('click', function (e) {
        startLoader();
        let startTime = Date.now();
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
        let userFirstName = document.getElementById('firstName').value;
        let userLastName = document.getElementById('lastName').value;

        let newUser = {
            name: userFirstName,
            surname: userLastName
        };

        fetch('/post-new-user', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {'Content-Type': 'application/json'}
        }).then((response) => {
            console.log("Time in milliseconds: " + startTime - Date.now());
            response.json().then((data) => {
                hideLoader();
                document.getElementById('rkvacUsed').hidden = true;
                if (data.rkvacUsed) {
                    document.getElementById('rkvacUsed').hidden = false;
                    return;
                }
                if (data.success) {
                    document.getElementById('messageOK').hidden = false;
                    document.getElementById('messageError').hidden = true;
                    refreshTable();
                    return;
                }
                if (!data.success) {
                    document.getElementById('messageOK').hidden = true;
                    document.getElementById('messageError').hidden = false;
                    return;
                }
                throw new Error('Request failed.');
            }).catch(function (error) {
                hideLoader();
                console.log(error);
            });
        });
        connect(selectedCard.value);
        document.getElementById('firstName').value = "";
        document.getElementById('lastName').value = "";
    });

    async function refreshTable() {
        const root = document.querySelector(".userTable[data-url]");
        const table = root.querySelector(".table-userTable");
        const response = await fetch(root.dataset.url).catch(function (error) {
            console.log(error);
        });
        const userData = await response.json();
        let date = new Date();
        let dateFormat = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ":" + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
        document.getElementById('updatedDate').innerHTML = "Updated: " + dateFormat;
        if (userData.error === true) {
            console.log("Failed to get data");
            return;
        }

        //Clear table
        table.querySelector("thead tr").innerHTML = "";
        table.querySelector("tbody").innerHTML = "";

        //Populate headers
        for (const header of userData.headers) {
            table.querySelector("thead tr").insertAdjacentHTML("beforeend", `<th>${header}</th>`);
        }

        //Populate rows
        for (const row of userData.rows) {
            table.querySelector("tbody").insertAdjacentHTML("beforeend", `
                <tr>
                    ${row.map(col => `<td>${col}</td>`).join("")}               
                </tr>
            `);
        }
    }

    document.getElementById('btnRefreshUsers').addEventListener('click', function (e) {
        document.getElementById('btnRefreshUsers').className += " table-refresh__button--refreshing";
        refreshTable().then(() => {
            document.getElementById('btnRefreshUsers').className = document.getElementById('btnRefreshUsers').className.replace(" table-refresh__button--refreshing", "");
        });
    });

    function startLoader() {
        document.getElementById('login-loader').hidden = false;
    }

    function hideLoader() {
        document.getElementById('login-loader').hidden = true;
    }

    async function ListReaders() {
        var reader_ul = document.getElementById('readerList');
        while (reader_ul.firstChild) {
            reader_ul.removeChild(reader_ul.firstChild);
        }
        var _readers = await navigator.webcard.readers();
        if (_readers[0]) {
            document.getElementById('cardError').hidden = true;
            _readers.forEach((reader, index) => {
                var node = document.createElement('li');
                reader_ul.append(node)
                node.outerHTML = `
            <input type="radio" class="w3-radio w3-bar-item cardSelector" name="cardIndex" value="${index}">
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

}
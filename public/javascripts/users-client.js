{

    const btnNewUser = document.getElementById('btnNewUser');
    btnNewUser.addEventListener('click', function (e) {
        startLoader();
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
            response.json().then((data) => {
                hideLoader();
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
                console.log(error);
            });
        });
        connect();
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
        refreshTable();
    });

    function startLoader() {
        document.getElementById('login-loader').hidden = false;
    }

    function hideLoader() {
        document.getElementById('login-loader').hidden = true;
    }

    window.onload = refreshTable;

}
{
    /**
     * User functions
     *
     */

    const btnNewUser = document.getElementById('btnNewUser');
    btnNewUser.addEventListener('click', function(e) {
        let userFirstName = document.getElementById('firstName').value;
        let userLastName = document.getElementById('lastName').value;

        let newUser = {
            name: userFirstName,
            surname: userLastName
        };

        fetch('/post-new-user', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: { 'Content-Type': 'application/json'}
        }).then(function(response) {
            if(response.ok) {
                document.getElementById('message').hidden = false;
                document.getElementById('message').innerHTML = 'Uživatel vytvořen a přirazen na kartu';
                document.getElementById('message').className += " w3-text-green";
                location.reload();
                return;
            }
            if(response.status === 503) {
                document.getElementById('message').hidden = false;
                document.getElementById('message').innerHTML = 'Požadavek nebyl úspěšný';
                document.getElementById('message').className += " w3-text-red";
                return;
            }
            throw new Error('Request failed.');
        }).catch(function(error) {
                console.log(error);
            });
        connect();
        document.getElementById('firstName').value = "";
        document.getElementById('lastName').value = "";
    });

    async function refreshTable(root) {
        // console.log("Table refreshed!");

        const table = root.querySelector(".table-userTable");
        const response = await fetch(root.dataset.url).catch(function(error) {
            console.log(error);
        });
        const userData = await response.json();

        //Clear table
        table.querySelector("thead tr").innerHTML = "";
        table.querySelector("tbody").innerHTML = "";

        //Populate headers
        for (const header of userData.headers) {
            table.querySelector("thead tr").insertAdjacentHTML("beforeend", `<th>${ header }</th>`);
        }

        //Populate rows
        for (const row of userData.rows) {
            table.querySelector("tbody").insertAdjacentHTML("beforeend", `
                <tr>
                    ${ row.map(col => `<td>${ col }</td>`).join("") }               
                </tr>
            `);
        }
    }

    for (const root of document.querySelectorAll(".userTable[data-url]")) {
        const btnRefreshUsers = document.getElementById('btnRefreshUsers');
        const table = document.createElement("table");
        table.classList.add("w3-table-all");
        table.classList.add("w3-gray");
        table.classList.add("table-userTable");

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

        btnRefreshUsers.addEventListener('click', function (e) {
            console.log('Button clicked!');
            refreshTable(root);
        });

        refreshTable(root);
    }

}
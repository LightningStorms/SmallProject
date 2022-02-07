const urlBase = 'http://anotherdayinparadise.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	console.log(login);
//	var hash = md5( password );

	document.getElementById("result").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	// Login.php
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("result").innerHTML = "Incorrect Username/Password";
					return;
				}

				firstName = jsonObject.login;
				lastName = jsonObject.password;

				saveCookie();

				// change to contacts.html when it is made :D
				window.location.href = "table.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("result").innerHTML = err.message;
	}

}

function doRegister()
{
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Registration.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				error = jsonObject.error;
				if (error == "")
				{
					window.location.href = "index.html";
    			  	return;
				}
        		document.getElementById("registerResult").innerHTML = error;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	// else
	// {
	// 	document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	// }
}


function addContact()
{
    readCookie();

	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let email = document.getElementById("email").value;
	let phone = document.getElementById("phoneNumber").value;

    let tmp = {firstName:firstName, lastName:lastName, email:email, phone:phone, userId:userId}
	let jsonPayload = JSON.stringify( tmp );

    document.getElementById("resultAdd").innerHTML = "";

	let url = urlBase + '/CreateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
                window.location.href = "table.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
        // displays error message if failed contact adding
		document.getElementById("resultAdd").innerHTML = err.message;
	}

}


function deleteContact(ID)
{
	let tmp = {ID:ID};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Delete.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
          		// rerun the show contact command here
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
        // Possible error return here through html changing.
	}
}


function searchContact()
{
	readCookie();
	let srch = document.getElementById("searchInfo").value;

	// let tmp = {UserID:userId,fullName:srch};
	// let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Search.' + extension;

	// let xhr = new XMLHttpRequest();
	// xhr.open("POST", url, true);
	// xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	let contacts = [{"firstName":"Bob","lastName":"Smith","email":"bsmith@gmail.com","phoneNumber":123}, {"firstName":"Frank","lastName":"Joe","email":"franks@gmail.com","phoneNumber":123123},{"firstName":"anne","lastName":"joes","email":"joeilly@gmail.com","phoneNumber":983274823}];
	console.log(contacts);
	// let tmp = JSON.stringify(contacts);
	createTable(contacts, 3);
	// try
	// {
	// 	xhr.onreadystatechange = function()
	// 	{
	// 		// if (this.readyState == 4 && this.status == 200)
	// 		// {
	// 			// let contacts = JSON.parse(xhr.responseText);
	//
	// 		// }
	// 	};
	// 	xhr.send(jsonPayload);
	// }
	// catch(err)
	// {
	// 	// error later if wanted
	// }
}



function createTable(contacts, numContacts)
{
  var tblBody = document.getElementById("tableBody");
  tblBody.innerHTML = "";
  var row;
  var cell;
  var cellText;


  for(var i = 0; i < numContacts; i++)
  {
    row = document.createElement("tr");

    cell = document.createElement("td");
	console.log(contacts[i].firstName)
    cellText = document.createTextNode(contacts[i].firstName);
    cell.appendChild(cellText);
    row.appendChild(cell);

	cell = document.createElement("td");
	cellText = document.createTextNode(contacts[i].lastName);
	cell.appendChild(cellText);
	row.appendChild(cell);

    cell = document.createElement("td");
    cellText = document.createTextNode(contacts[i].phoneNumber);
    cell.appendChild(cellText);
    row.appendChild(cell);

    cell = document.createElement("td");
    cellText = document.createTextNode(contacts[i].email);
    cell.appendChild(cellText);
    row.appendChild(cell);

	row.setAttribute("id", "row" + i);
	tblBody.appendChild(row);
  }
}

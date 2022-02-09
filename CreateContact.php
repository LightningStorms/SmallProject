<?php

$inData = getRequestInfo();

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "UserInfo");

if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName FROM Contacts WHERE FirstName=? and LastName=? and Email=? and Phone=? and UserID=?");
    $stmt->bind_param("ssssi", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"], $inData["userId"]);
    $stmt->execute();
    $result = $stmt->get_result();

    if($row = $result->fetch_assoc())
    {
        returnWithError("Contact Already Exists");
    }
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Email, Phone, UserID) VALUES(?,?,?,?,?)");
        $stmt->bind_param("ssssi", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"], $inData["userId"]);
        $stmt->execute();

        returnWithError("");
    }

    $stmt->close();
    $conn->close();
}
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

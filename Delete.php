<?php

$inData = getRequestInfo();

//$firstName = $inData["firstName"];
//$lastName = $inData["lastName"];
//$username = $inData["login"];
//$password = $inData["password"];
$id = $inData["ID"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "UserInfo");

if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $stmt->close();
    $conn->close();

    returnWithError("");
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
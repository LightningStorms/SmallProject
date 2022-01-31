<?php

$inData = getRequestInfo();

$id = $inData["ID"];
$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$email = $inData["Email"];
$phone= $inData["Phone"];


$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "UserInfo");

if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=?  where ID=?");
    $stmt->bind_param("ssssi", $firstName,$lastName,$email,$phone,$id);
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
<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;
$FullName = '%' . $inData["input"] . '%';
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "UserInfo");

if ($conn->connect_error)
{
    returnWithError( $conn->connect_error );
}
else
{
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, Phone FROM Contacts WHERE UserID=? and (CONCAT(FirstName,' ',LastName) like ? or Email like CONCAT ('%', ?, '%') or Phone like CONCAT ('%', ?, '%'))");
    $stmt->bind_param("isss", $inData["id"], $FullName, $inData["input"], $inData["input"]);
    $stmt->execute();

    $result = $stmt->get_result();

    while($row = $result->fetch_assoc())
    {
        if( $searchCount > 0 )
        {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"contactID":"' . $row["ID"] . '","firstName":"' . $row["FirstName"] . '","lastName":"' . $row["LastName"] . '","email":"' . $row["Email"] . '", "phone":"' . $row["Phone"] . '"}';
    }

    if( $searchCount == 0 )
    {
        returnWithError( "No Records Found" );
    }
    else
    {
        returnWithInfo( $searchResults );
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
    $retValue = '{"ID":0,"ContactID":"","FirstName":"","LastName":"","Email":"","Phone":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $searchResults )
{
    $retValue = '[' . $searchResults . ']';
    sendResultInfoAsJson( $retValue );
}

?>

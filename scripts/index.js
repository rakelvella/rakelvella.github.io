function PrintLog() {
    client = new Paho.MQTT.Client("hairdresser.cloudmqtt.com", 35730,
        "web_" + parseInt(Math.random() * 100, 10));
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    var options = {
            useSSL: true,
            userName: "wihffhzu",
            password: "fmsRy2CbovXp",
            onSuccess: sendPrintLogMessage,
            onFailure: doFail
        }
        // connect the client
    client.connect(options);
}

// called when the client connects
function sendPrintLogMessage() {
    message = new Paho.MQTT.Message("Forward");
    message.destinationName = "RobotControl";
    client.send(message);
}

function doFail() {
    alert("Error!");
}
// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        alert("onConnectionLost:" +
            responseObject.errorMessage);
    }
}
// called when a message arrives
function onMessageArrived(message) {
    document.getElementById('messageTxt').value =
        message.payloadString;
}

function onsubsribeDistanceDataSuccess() {
    client.subscribe("distance");
    alert("Subscribed to distance data");
}

function subscribeDistanceData() {
    client = new Paho.MQTT.Client("hairdresser.cloudmqtt.com", 35730,
        "web_" + parseInt(Math.random() * 100, 10));
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    var options = {
            useSSL: true,
            userName: "wihffhzu",
            password: "fmsRy2CbovXp",
            onSuccess: onsubsribeDistanceDataSuccess,
            onFailure: doFail
        }
        // connect the client
    client.connect(options);
}
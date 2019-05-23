/*! file: database.js  */
// Set Element into Localstorage
function setItem(a, b) {
    var value = document.getElementById(b).value;
    value === 'undefined' ? '' : value;

    localStorage.setItem(a, value);
    console.log(a + ' = ' + value);
}

var submitted = false;

// Report fault
function reportFault() {
	submitted = true;

    // Use current date as ID
    var date = new Date();
    var id = date.getTime();
    localStorage.setItem('id', id);
    console.log('id = ' + id);

    setItem('staffId','staff-id')
    setItem('faultDate', 'fault-date')
    setItem('faultTime', 'fault-time')
    setItem('trainNo', 'train-no')
    setItem('coachNo', 'coach-no')
    setItem('seatNo', 'seat-no')
    setItem('fromLocation', 'from-location')
    setItem('toLocation', 'to-location')
    setItem('faultType', 'fault-type')
    setItem('faultDesc', 'fault-desc')

    var photo = document.getElementById('fault-photo').value;
    console.log(photo.src);
    photo === 'undefined' ? '' : photo.value;
    localStorage.setItem('faultPhoto', photo);
    console.log(photo);

    startDB(); 

    // Reset form and show subbmitted popup
	document.getElementById('report-form').reset();
	$('#modal-submitted').modal('open'); 
    return false;
}

// Start Database
function startDB() {
    var db = window.openDatabase('Database', '1.0', 'REPORTS', 2000000);
    db.transaction(populateDB, errorCB, successCB);
}

// Get Local Storage Item
function getItem(name) {
    return localStorage.getItem(name);
}

// Insert Row
function populateDB(db) {
    db.executeSql('CREATE TABLE IF NOT EXISTS REPORTS (id TEXT NOT NULL, staffId TEXT NULL, faultDate TEXT NULL, faultTime TEXT NULL, trainNo TEXT NULL, coachNo TEXT NULL, seatNo TEXT NULL, fromLocation TEXT NULL, toLocation TEXT NULL, faultType TEXT NULL, faultDesc TEXT NULL, faultPhoto TEXT NULL)', []);
    db.executeSql('INSERT INTO REPORTS (id, staffId, faultDate, faultTime, trainNo, coachNo, seatNo, fromLocation, toLocation, faultType, faultDesc, faultPhoto) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [getItem('id'), getItem('staffId'), getItem('faultDate'), getItem('faultTime'), getItem('trainNo'), getItem('coachNo'), getItem('seatNo'), getItem('fromLocation'), getItem('toLocation'), getItem('faultType'), getItem('faultDesc'), getItem('faultPhoto')]);
   
    //queryDB(db);
}

// Query Database
function queryDB(db) {
    db.executeSql("SELECT * FROM REPORTS", [], querySuccess, errorCB);
}

// Query Success
function querySuccess(db, results) {
    var numOfRows = results.rows.length;
    
    for (var i = 0; i < numOfRows; i++) { 
    	var item = results.rows.item(i);
        var id = item.id;

        document.getElementById("reports").innerHTML += ('<div class="col s12 m6"><div class="card image-none"><div class="card-image">'
        	//+ '<div><img class="materialboxed" src="' + item.faultPhoto + '"></div>'
			+ '<a class="switch support btn-floating halfway-fab red"><i class="material-icons">plus_one</i><div>Support</div></a></div>'
			+ '<div class="card-content"><span class="card-title">' + item.faultType + '</span>'
			+ '<span class="card-date">' + item.faultDate + ' at ' + item.faultTime + '</span>'
			+ '<p>' + item.faultDesc + '</p>'
			+ (item.staffId == '' ? '' : '<div class="chip tool-tip" data-position="bottom" data-tooltip="Staff ID."><i class="material-icons">person</i>' + item.staffId + '</div>')
            + (item.trainNo == '' ? '' : '<div class="chip tool-tip" data-position="bottom" data-tooltip="Train Number."><i class="material-icons">train</i>' + item.trainNo + '</div>')
            + (item.coachNo == '' ? '' : '<div class="chip tool-tip" data-position="bottom" data-tooltip="Coach Number."><i class="material-icons">people</i>' + item.coachNo + '</div>')
            + (item.seatNo == '' ? '' : '<div class="chip tool-tip" data-position="bottom" data-tooltip="Seat Number."><i class="material-icons">event_seat</i>' + item.seatNo + '</div>')
            + (item.fromLocation == '' ? '' : '<div class="chip tool-tip" data-position="bottom" data-tooltip="Departure Location."><i class="material-icons">location_on</i>' + item.fromLocation + '</div>')
            + (item.toLocation == '' ? '' : '<div class="chip tool-tip" data-position="bottom" data-tooltip="Destination Location."><i class="material-icons">navigation</i>' + item.toLocation + '</div>')
            + '<div class="chip new tool-tip" data-position="bottom" data-tooltip="Recently added and not yet assigned."><i class="material-icons">access_time</i>New</div>'
            + '<div class="chip supporters tool-tip" data-position="bottom" data-tooltip="Number of people who have supported the fault to be fixed."><i class="material-icons">thumb_up</i>0 Supporters</div>'
            + '</div></div></div>');
    }
}

// Show Database
function showDB(db) {
    var openDb = window.openDatabase("Database", "1.0", "REPORTS", 2000000);
    openDb.transaction(createDB, errorCB, successCB);    

}

// Create Database
function createDB(db) {
    db.executeSql("SELECT * FROM REPORTS", [], querySuccess, errorCB);
}

// Success Callback
function successCB() {
    console.log(" --- Success! --- ");
    $(document).trigger('db_loaded');
}

// Error Callback
function errorCB(error) {
    if (error.code == "0")
        console.log("0 - UNKNOWN_ERR: The transaction failed for reasons unrelated to the database itself and not covered by any other error code.");
    else if (error.code == "1")
        console.log("1 - DATABASE_ERR: The statement failed for database reasons not covered by any other error code.");
    else if (error.code == "2")
        console.log("2 - VERSION_ERR: The operation failed because the actual database version was not what it should be. For example, a statement found that the actual database version no longer matched the expected version of the Database or DatabaseSync object, or the Database.changeVersion() or DatabaseSync.changeVersion() methods were passed a version that doesn't match the actual database version.");
    else if (error.code == "3")
        console.log("3 - TOO_LARGE_ERR: The statement failed because the data returned from the database was too large. The SQL 'LIMIT' modifier might be useful to reduce the size of the result set.");
    else if (error.code == "4")
        console.log("4 - QUOTA_ERR: The statement failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.");
    else if (error.code == "5")
        console.log("5 - SYNTAX_ERR: The statement failed because of a syntax error, or the number of arguments did not match the number of ? placeholders in the statement, or the statement tried to use a statement that is not allowed, such as BEGIN, COMMIT, or ROLLBACK, or the statement tried to use a verb that could modify the database but the transaction was read-only.");
    else if (error.code == "6")
        console.log("6 - CONSTRAINT_ERR: An INSERT, UPDATE, or REPLACE statement failed due to a constraint failure. For example, because a row was being inserted and the value given for the primary key column duplicated the value of an existing row.");
    else if (error.code == "7")
        console.log("7 - TIMEOUT_ERR: A lock for the transaction could not be obtained in a reasonable time.");
    else 
    	document.getElementById("reports").innerHTML += '<p class="center">No fault has been reported yet!</p>';
}


// Drop Database
function dropDb() {
    // Clear localStorage
    window.localStorage.clear();

    // Get database
    var openDb = window.openDatabase("Database", "1.0", "REPORTS", 2000000);
    openDb.transaction(dropDatabase, errorCB, successCB);
}

// Drop Database
function dropDatabase(db) {
    db.executeSql('DROP TABLE IF EXISTS REPORTS');
    console.log(" --- Table Dropped! --- ");
}

// Show DB on Load
showDB();
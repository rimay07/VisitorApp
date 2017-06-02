/**
 * ...
 * @author Ricky Sadiwa
 */

Input = function()
{
	var visitorData = new Object();
	
	this.postData = function(arr, url)
	{
		var http = new XMLHttpRequest
		var urlToPost = "php/" + url + ".php";
		http.open("POST", urlToPost, true);

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		http.onreadystatechange = function() {//Call a function when the state changes.
			if(http.readyState == 4 && http.status == 200) {
				 processResp(http.responseText);
			}
		}
		http.send('visitorDetails='+JSON.stringify(arr));
	};
	
	this.getInput = function(form)
	{
		var inputData = processInput(form);
		alert(JSON.stringify(inputData));
		//if(inputData)this.postData();	
	};		
	
	this.getTextAreaInput = function(string)
	{
		var inputData = processTextAreaInput(string);
		if(inputData)this.postData(inputData, "name");	
	};	
	
	this.processLocalFile = function(){
		var submit = document.getElementById('local'), 
		file = document.getElementById('userfile');
		
		if(file.files.length === 0){
			return;
		}

		var data = new FormData();
		data.append('SelectedFile', file.files[0]);

		var http = new XMLHttpRequest();
		http.onreadystatechange = function(){
			if(http.readyState == 4 && http.status == 200){
				try {
					processResp(http.responseText);
				} catch (e){
					var resp = {
						status: 'error',
						data: 'Unknown error occurred: [' + http.responseText + ']'
					};
				}
			}
		};
		http.open('POST', 'php/parseUpload.php');
		http.send(data);
	}
	
	this.processQrcode = function(string){
		input.getTextAreaInput(string);
	}
	
	this.isCharKey = function(evt)
	{
		var charCode = (evt.which) ? evt.which : event.keyCode
		console.log(event.keyCode);
		if ((charCode < 65 && charCode !== 32) || (charCode < 97 && charCode > 90) || charCode > 122){
			alert("Please Input Letters Only");
			return false;
		}
		else return true;
	};	

	function validateEmail(email){
	    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return regex.test(email);
	}

	function processTextAreaInput(string){
		var mainArr = string.split("\n");
		for (var a = 0; a < mainArr.length; a++){
			if(mainArr[a].indexOf(" ") > -1){
				var temp = mainArr[a].split(" ");
				mainArr.splice(a, 1, temp);
			}
		}
		return mainArr;
	}
	
	function processResp(resp){
		try{
			var visitorObj =  JSON.parse(resp);
			var date = new Date();
			var secs = date.getSeconds();
			secs = (secs < 10) ? ("0" + secs) : secs;
			document.getElementById('name').value = visitorObj.name;
			document.getElementById('company').value = visitorObj.company;
			document.getElementById('idNumber').value = visitorObj.id;
			document.getElementById('date').value = (date.getMonth() + 1) + " / " + date.getDate() + " / " + date.getFullYear();
			document.getElementById('timeIn').value = date.getHours() + " : " + date.getMinutes() + " : " + secs;
			closeOverlay();
		} catch (e) {
			console.log(e);
		}
	}
	
	function processInput(form){
		var currForm = document.getElementById(form);
		var blankFields = [];
	    for (var formIdx = 0; formIdx< currForm.length; formIdx++) {
	    	var field = currForm.elements[formIdx].name;
	    	var fieldValue = currForm.elements[formIdx].value;
	    	var fieldName = null;
	    	switch (field) {
	    		case "company":
	    			fieldName = "COMPANY";
					visitorData[field] = fieldValue;
	    			break;
	    		case "idNumber":
	    			fieldName = "ID NUMBER";
					visitorData[field] = fieldValue;
	    			break;
	    		case "name":
	    			fieldName = "NAME";
					visitorData[field] = fieldValue;
	    			break;
	    		case "personToVisit":
	    			fieldName = "PERSON TO VISIT";
					visitorData[field] = fieldValue;
	    			break;
	    		case "department":
	    			fieldName = "DEPARTMENT";
					visitorData[field] = fieldValue;
	    			break;
	    		case "date":
	    			fieldName = "DATE";
					visitorData[field] = fieldValue;
	    			break;
	    		case "timeIn":
	    			fieldName = "TIME IN";
					visitorData[field] = fieldValue;
	    			break;
	    		case "timeOut":
	    			fieldName = "TIME OUT";
					visitorData[field] = fieldValue;
	    			break;
	    	};

	        if(fieldName != null && (fieldValue == null || fieldValue == "")){
		        blankFields.push(fieldName);
	        } 
	    }
		
		if(blankFields.length > 0){
			alert("The Following Fields are required: " + blankFields);
		} else {
			return visitorData;
		}
	}
}
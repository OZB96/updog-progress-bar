$(document).ready(function () {
	$('#tableData').DataTable({
		"paging" : false,
		"language" : {
		    "info" : "_TOTAL_ items",
		},
		"columnDefs" : [
			{"targets" : 0, "orderable" : false},
			{"targets" : 4, "orderable" : false},
			{"orderSequence" : [ "desc", "asc" ], "targets": [ 1 ]}
		],
		order: [[ 1, "asc" ]]
	});
});

function uploadFile() {
var file = document.getElementById('file').files[0];
var formData = new FormData();
formData.append("file", file);

var xhr = new XMLHttpRequest();
xhr.open("POST", "/upload", true);

xhr.upload.onprogress = function(event) {
	if (event.lengthComputable) {
	var percentComplete = (event.loaded / event.total) * 100;
	var progressBar = document.getElementById('progress-bar');
	var progressBarAlt = document.getElementById('progress-bar-alt');
	progressBar.style.width = percentComplete + '%';
	progressBar.innerHTML = Math.round(percentComplete) + '%';
	progressBarAlt.style.width = percentComplete + '%';
	}
};

// xhr.onload = function() {
// 	if (xhr.status == 200) {
// 	alert('File uploaded successfully.');
// 	} else {
// 	alert('File upload failed.');
// 	}
// };

xhr.send(formData);
}


var inputs = document.querySelectorAll( '.uploadFile' );

Array.prototype.forEach.call( inputs, function( input )
{
	var label	 = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener( 'change', function( e )
	{
		var fileName = '';
		if( this.files && this.files.length > 1 )
			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
		else {
			fileName = e.target.value.split("\\").pop();
		}

		if( fileName )
			label.querySelector( 'span' ).innerHTML = fileName;
		else
			label.innerHTML = labelVal;
	});
});
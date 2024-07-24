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
	console.log*("triggrerd");
	var file = document.getElementById('file').files[0];
	var path = document.getElementById('path').value;	
	var chunkSize = 1024 * 1024; // 1MB chunk size
	var totalChunks = Math.ceil(file.size / chunkSize);
	var progressBar = document.getElementById('progress-bar');
	var progressBarAlt = document.getElementById('progress-bar-alt');
	
	for (var chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
		var start = chunkNumber * chunkSize;
		var end = Math.min(file.size, start + chunkSize);
		var chunk = file.slice(start, end);
		
		uploadChunk(chunk, chunkNumber, totalChunks, file.name);
	}

	function uploadChunk(chunk, chunkNumber, totalChunks, filename) {
		var formData = new FormData();
		formData.append('file', chunk);
		formData.append('chunk_number', chunkNumber);
		formData.append('total_chunks', totalChunks);
		formData.append('filename', filename);
		formData.append('path', path);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/upload', true);
		
		xhr.onload = function() {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'complete') {
					alert('File uploaded successfully.');
				} else if (response.status === 'error' && response.expected_chunk !== undefined){
					var retryChunkNumber = response.expected_chunk;
                    var start = retryChunkNumber * chunkSize;
                    var end = Math.min(file.size, start + chunkSize);
                    var retryChunk = file.slice(start, end);
                    uploadChunk(retryChunk, retryChunkNumber, totalChunks, filename);
				}else {
				var percentComplete = ((chunkNumber + 1) / totalChunks) * 100;
				progressBar.style.width = percentComplete + '%';
				progressBar.innerHTML = Math.round(percentComplete) + '%';
				progressBarAlt.style.width = percentComplete + '%';
				}
			} else {
				alert('File upload failed.');
			}
		};
		
		xhr.send(formData);
	}
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
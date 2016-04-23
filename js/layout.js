$(document).ready(function() {
	$(document).keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			apply();   
		}
	});
    $('#bg-opacity').change(changeOpacity);
	$('#loadDataBtn').click(function() {$('#openFile').click();});
	$('#openFile').bind('change',loadData);
	$('#apply').click(apply);
	$('#version').change(chooseVersion);
	$('input:checkbox').change(customization);
});

function changeOpacity() {
    var opacity = $('#bg-opacity').val()/100;
    $('#viewer').css('background-color', 'rgba(255, 255, 255, ' + opacity + ')');
}

var data;
var graph = {};
function loadData(event) {
    var files = event.target.files;
	var file = files[0];
	var reader = new FileReader();
	data = [];

	reader.onload = function(event) {
		// Load data
		var csv = reader.result;
		data = $.csv.toObjects(csv, {separator: ";"});

		// Set source and target options
		var counter = 0;
		$('#source option').remove();
		$('#target option').remove();
		Object.keys(data[0]).forEach(function(item){
			$('#source').append($('<option>', {
				value: item,
				text: item
			}));
			$('#target').append($('<option>', {
				value: item,
				text: item
			}));
			$('#nodeCValue').append($('<option>', {
				value: item,
				text: item
			}));
			$('#edgeCValue').append($('<option>', {
				value: item,
				text: item
			}));
			
			if (counter == 0) {
				$('#source').val(item);
			}
			
			if (counter == 1) {
				$('#target').val(item);
			}
			counter++;
		});
	};
	
	reader.readAsText(file);
	this.value = null;
}

function chooseVersion() {
	var version = this.value;
	$('#gridRangeOpt').remove();
	$('#thetaOpt').remove();
	$('#levelOpt').remove();
	switch(version) {
		case "grid":
			// Add more options for grid version
			var newOption = '<div class="form-group" id="gridRangeOpt">' +
					'<label for="gridRange" class="control-label col-sm-4">Grid Range</label>' +
					'<div class="col-sm-8">' +
					'<input type="number" class="form-control" id="gridRange" step="5" value="100"/>' +
					'</div>' +
					'</div>';
			$('#moreOptions').append(newOption);

			break;
		case "barnes":
			var theta = '<div class="form-group" id="thetaOpt">' +
				'<label for="theta" class="control-label col-sm-4">Theta</label>' +
				'<div class="col-sm-8">' +
				'<input type="number" class="form-control" id="theta" step="0.1" value="1.5"/>' +
				'</div>' +
				'</div>';
			$('#moreOptions').append(theta);
			var level = '<div class="form-group" id="levelOpt">' +
				'<label for="level" class="control-label col-sm-4">Level</label>' +
				'<div class="col-sm-8">' +
				'<input type="number" class="form-control" id="level" step="1" value="6"/>' +
				'</div>' +
				'</div>';
			$('#moreOptions').append(level);
			break;
	}
}

function apply() {
	var version = $('#version').val();
	if(data) {
		// Create graph
		createGraph(data, graph);
		switch(version) {
			case "basic":
				var start = new Date().getTime();
				fdBasic(graph);
				var end = new Date().getTime();
				var time = end - start;
				var html = time /1000 + "S";
				$('#fdTime').html(html);
				render(graph);
				break;
			case "grid":
				var start = new Date().getTime();
				fdGrid(graph);
				var end = new Date().getTime();
				var time = end - start;
				var html = time /1000 + "S";
				$('#fdTime').html(html);
				render(graph);
				break;
			case "barnes":
				var start = new Date().getTime();
				fdBarnes(graph);
				var end = new Date().getTime();
				var time = end - start;
				var html = time /1000 + "S";
				$('#fdTime').html(html);
				render(graph);
				break;	
			case "multilevel":
				//createGraphW(data, graph);
				var start = new Date().getTime();
				fdMulti(graph);
				var end = new Date().getTime();
				var time = end - start;
				var html = time /1000 + "S";
				$('#fdTime').html(html);
				render(graph);
				break;
		}
	}else {
		alert("Load Data First");
	}
}

function customization() {
	if(this.checked) {
		if(this.id == "nodeC") {
			$('#nodeCValue').attr('disabled', 'false');
			graph.nodeC = true;
			$('#ns').text("Node Maxium");
		}else {
			$('#edgeCValue').attr('disabled', 'false');
			graph.edgeC = true;
			$('#et').text("Edge Maxium");
		}
	}else {
		if(this.id == "nodeC") {
			$('#nodeCValue').attr('disabled', 'true');
			delete graph.maxNodeC;
			graph.nodeC = false;
			$('#ns').text("Node Size");
		}else {
			$('#edgeCValue').attr('disabled', 'true');
			graph.edgeC = false;
			$('#et').text("Edge Thickness");
		}
	}
}
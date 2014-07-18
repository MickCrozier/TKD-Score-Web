
var tx;

(function() {
	function xhr_json(data, callback) {
		$.ajax({
			type: "POST",
			url: '/com',
			async: 'false',
			dataType: 'json',
			data: JSON.stringify(data),
			beforeSend: function(x) {
				if(x && x.overrideMimeType) {
		        	x.overrideMimeType("application/j-son;charset=UTF-8");
		        }
			},
			success: function(result){
				var o = JSON.parse(result);
				if(o.responseType == 'error') {
			   		alert(o.value);
				} else {
					if(callback) callback(o);
				}
		   },
		});
	}
	tx = xhr_json;
})();











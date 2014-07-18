/**
 * 
 */






var app = {};
app.scriptpath = $("script[src]").last().attr("src").split('?')[0].split('/').slice(0, -1).join('/')+'/';
MC.include(app.scriptpath + 'xhr.js');
MC.include(app.scriptpath + 'dhtmlx/dhtmlx.js');
MC.include(app.scriptpath + 'UI.js');


var settings = {
	scoreTimeout : 500,

}

app.match_settings = {};
app.mat_settings = {};



var timerChong = false;
var timerHong = false;
var pointsChong = 0;
var pointsHong = 0;


app.soundHorn = function(mat) {
	var o = {
			command : 'soundHorn',
			id : mat,
		}
		tx(o, app.processResponse);
}

app.showtheLog = function(logtext) {
	var h = $('#log').html();
	h += logtext + '<br>&nbsp';
	$('#log').html(h)
	var objDiv = document.getElementById("log");
	objDiv.scrollHeight += 200;
	objDiv.scrollTop = objDiv.scrollHeight + 100;
}

app.showtheFullLog = function(logArray) {
	for (var i=0;i<logArray.length;i++) {
		app.showtheLog(logArray[i])
	}
}


app.testjson = function() {
	tx({
		command : 'score',
		who : 'hong'
	}, app.processResponse);
};

app.scoreChong = function(mat) {
	clearTimeout(timerChong);

	pointsChong += 1;
	timerChong = setTimeout(function() {
		tx({
			command : 'score',
			id:mat,
			who : 'chong',
			points : pointsChong
		});
		pointsChong = 0;
	}, settings.scoreTimeout)
}

app.scoreHong = function(mat) {
	clearTimeout(timerHong);

	pointsHong += 1;
	timerHong = setTimeout(function() {
		tx({
			command : 'score',
			id:mat,
			who : 'hong',
			points : pointsHong
		});
		pointsHong = 0;
	}, settings.scoreTimeout)
}

app.createMatch = function(settings) {
	settings.command = 'createMatch';
	tx(settings, app.processResponse);
}

app.createMat = function(settings) {
	settings.command = 'createMat';
	tx(settings, app.processResponse);
}

app.removeMatch = function(id) {
	var settings = {};
	settings.id = id;
	settings.command = 'removeMatch';
	tx(settings, app.processResponse);
}

app.removeMat = function(id) {
	var settings = {};
	settings.id = id;
	settings.command = 'removeMat';
	tx(settings, app.processResponse);
}

app.setMatchSettings = function(id, settings) {
	if (!id)
		throw 'setMatchSettings requires an id';
	settings.command = 'setMatMatchSettings';
	settings.id = id;
	tx(settings, app.processResponse);

}

app.setMatSettings = function(id, settings) {
	if (!id)
		throw 'setMatSettings requires an id';
	settings.command = 'setMatSettings';
	settings.id = id;
	tx(settings, app.processResponse);

}

app.getMatchSettings = function(id, callback) {
	if (!id)
		throw 'getMatchSettings requires an id';
	var o = {
		command : 'getMatchSettings',
		id : id,
	}
	tx(o, callback);
}
app.getMatSettings = function(id, callback) {
	if (!id)
		throw 'getMatSettings requires an id';
	var o = {
		command : 'getMatSettings',
		id : id,
	}
	tx(o, callback);
}

app.assignMatch = function(matId, matchId) {
	var o = {
		command : 'assignMatch',
		matId : matId,
		matchId : matchId,
	}
	tx(o, app.processResponse);
}

app.unassignMatch = function(matId) {
	var o = {
		command : 'unassignMatch',
		id : matId,
	}
	tx(o, app.processResponse);
}

app.requestMatSettingsStream = function(matId) {
	var o = {
		command : 'requestMatSettingsStream',
		id : matId,
	}
	tx(o, app.processResponse);
}

app.requestMatchSettingsStream = function(matId) {
	var o = {
		command : 'requestMatchSettingsStream',
		id : matId,
	}
	tx(o, app.processResponse);
}

app.requestRunningDataStream = function(matId) {
	var o = {
		command : 'requestRunningDataStream',
		id : matId,
	}
	tx(o, app.processResponse);
}

app.resumestopRound = function(matId, callback) {
	var o = {
		command : 'resumestopRound',
		id : matId,
	}

	tx(o, callback);
}

app.resetRoundClock = function(matId, maxtime, callback) {
	var o = {
		command : 'resetRoundClock',
		maxtime : maxtime,
		id : matId,
	}
	if (maxtime)
		o.maxtime = maxtime;
	tx(o, callback);
}

app.resumestopBreak = function(matId, callback) {
	var o = {
		command : 'resumestopBreak',
		id : matId,
	}

	tx(o, callback);
}

app.resetBreakClock = function(matId, maxtime, callback) {
	var o = {
		command : 'resetBreakClock',
		maxtime : maxtime,
		id : matId,
	}
	if (maxtime)
		o.maxtime = maxtime;
	tx(o, callback);
}

app.resumestopInjury = function(matId, callback) {
	var o = {
		command : 'resumestopInjury',
		id : matId,
	}

	tx(o, callback);
}

app.resetInjuryClock = function(matId, maxtime, callback) {
	var o = {
		command : 'resetInjuryClock',
		maxtime : maxtime,
		id : matId,
	}
	if (maxtime)
		o.maxtime = maxtime;
	tx(o, callback);
}

app.declareWinner = function(matId, who, how, callback) {
	var o = {
		command : 'declareWinner',
		id : matId,
		who:who,
		how:how,
	}

	tx(o, callback);
	
}

app.undeclareWinner = function(matId, who, how, callback) {
	var o = {
		command : 'undeclareWinner',
		id : matId,
	
	}

	tx(o, callback);
	
}

app.resetMatch = function(matId, callback) {
	var o = {
		command : 'resetMatch',
		id : matId,
	
	}

	tx(o, callback);
	
}

app.scoreChange = function(matId, hong, points, callback) {
	var who;
	if (hong) {
		who = 'hong';
	} else {
		who = 'chong';
	}

	
	
	if(who == 'hong') {
	clearTimeout(timerHong);
	
	pointsHong += points;
		timerHong = setTimeout(function() {
			if(pointsHong>4) pointsHong = 4;
			tx({
				command : 'scoreChange',
				who : who,
				ref:false,
				points : pointsHong,
				id : matId,
			}, callback);
			pointsHong = 0;
		}, settings.scoreTimeout)
	} else {
	
		clearTimeout(timerChong);

		pointsChong += points;
		timerChong = setTimeout(function() {
			if(pointsChong>4) pointsChong = 4;
			tx({
				command : 'scoreChange',
				who : who,
				ref:false,
				points : pointsChong,
				id : matId,
			}, callback);
			pointsChong = 0;
		}, settings.scoreTimeout)
	}
	

	
}

app.roundChange = function(matId, rounds, callback) {

	var o = {
		command : 'roundChange',
		rounds : rounds,
		id : matId,
	}
	tx(o, callback)
}



app.penaltyChange = function(matId, hong, points, callback) {
	var who;
	if (hong) {
		who = 'hong';
	} else {
		who = 'chong';
	}

	if(who == 'hong') {
		clearTimeout(timerHong);
		
		pointsHong += points;
			timerHong = setTimeout(function() {
				if(pointsHong>2) pointsHong = 2;
				tx({
					command : 'penaltyChange',
					who : who,
					ref:false,
					points : pointsHong,
					id : matId,
				}, callback);
				pointsHong = 0;
			}, settings.scoreTimeout)
		} else {
		
			clearTimeout(timerChong);

			pointsChong += points;
			timerChong = setTimeout(function() {
				if(pointsChong>2) pointsChong = 2;
				tx({
					command : 'penaltyChange',
					who : who,
					ref:false,
					points : pointsChong,
					id : matId,
				}, callback);
				pointsChong = 0;
			}, settings.scoreTimeout)
		}
	
}




app.processResponse = function(response) {
	var o = response;
	var s = '';
	for (prop in o) {
		s += prop + ':' + o[prop] + '\n';
	}
	//alert(s)
	//var h = $('#log').html();
	//h += '<br>' + s;
	//$('#log').html(h)
};

app.getFullLog = function(matId, callback) {
	var o = {
			command : 'getLog',
			id : matId,
		
		}

		tx(o, callback);
}

app.getFullMasterLog = function(callback) {
	var o = {
			command : 'getMasterLog',
		}
		
		tx(o, callback);
}

app.getImage = function(name, x, y, id) {
	var r = '<img src="/web/images/' + name + '.png"';
	if(id) r+= ' id="' + id + '"';
	if(x) r+=' width="' + x + '"';
	if(y) r+=' height="' + y + '"';

	r+='></img>';
	//var r = '&#x2588 ';
	return r;
}

app.getDeviceRole = function(callback) {
	var o = {
		command : 'getDeviceRole',
	}
	tx(o, callback)
}

app.registerDevice = function(role, mat, callback) {
	var o = {
		command : 'registerDevice',
		role: role,
		mat: mat
	}
	tx(o, callback)
}

app.reregister = function() {
	window.location.replace('./?q=register');
}

app.deRegisterIp = function(ip, callback) {
	var o = {
		command : 'deRegisterDevice',
		deviceip: ip,
	}
	tx(o, callback)
}

app.getDeviceList = function(matId, callback) {

	var o = {
		command : 'getDeviceList',
		id: matId
	}
	
	tx(o, callback)
}





app.formButtonHandlers = function(id) {
	switch(id) {
	case 'saveNewMat':
		app.createMat(UI.matFormWindow.myForm.getData())
	    UI.matFormWindow.close();
		
		break;
	
	case 'cancelMat':
		UI.matFormWindow.close();
		break;
		
	case 'saveMat':
		app.setMatSettings(mat, UI.matFormWindow.myForm.getData())
	    UI.matFormWindow.close();
		
		break;
		
	case 'saveNewMatch':
		app.createMatch(UI.matchFormWindow.myForm.getData())
	    UI.matchFormWindow.close();
		
		break;
	
	case 'cancelMatch':
		UI.matchFormWindow.close();
		break;
		
		
	case 'saveMatch':
		app.setMatchSettings(mat, UI.matchFormWindow.myForm.getData())
	    UI.matchFormWindow.close();
		
		break;
	
	
		default:
	}
}


//app.registerDevice(role, mat)
app.registerDeviceResponse = function(data) {
	// data.accepted  // TRUE OR FALSE
	// data.role
	// data.mat
	// data.url
	//data.ip  ///if it's in use
	
	if(data.accepted) {
		//window.location.replace(data.url) // SAME AS REDIRECT
		window.location.href = data.url; // SAME AS CLICK LINK
	} else {
		UI.alert('Unable to assign', 'Damn!')
	}
	
}

app.defaultHandlers = function(id) {
	
	
	switch (id) {
	
	case 'editmatch':
		if(!UI.wins.isWindow('matchFormWindow')) UI.matchFormWindow = UI.createMatchFormWindow(app.formButtonHandlers, app.match_settings);
		break;
		
	case 'editmat':
		if(!UI.wins.isWindow('matFormWindow')) UI.matFormWindow = UI.createMatFormWindow(app.formButtonHandlers, app.mat_settings);
		break;
	
	case 'newmatch':	
	case 'creatematch':
		if(!UI.wins.isWindow('matchFormWindow')) UI.matchFormWindow = UI.createMatchFormWindow(app.formButtonHandlers);
		break;
		
	case 'createmat':
		if(!UI.wins.isWindow('matFormWindow')) UI.matFormWindow = UI.createMatFormWindow(app.formButtonHandlers);
		break;
		
	case 'reregister':
		app.reregister();
		break;
	
	case 'resetroundclock':
		app.resetRoundClock(mat)
		break;
		
	case 'resetbreakclock':
		app.resetBreakClock(mat)
		break;
	case 'resetinjuryclock':
		app.resetInjuryClock(mat)
		break;
	case 'roundup':
		app.roundChange(mat, 1)
		break;
	case 'rounddown':
		app.roundChange(mat, -1)
		break;
	case 'resetmatch':
		app.resetMatch(mat)
		break;
	case 'dwhong':
		app.declareWinner(mat, 'Hong')
		break;
	case 'dwchong':
		app.declareWinner(mat, 'Chong')
		break;
		
	case 'dqhong':
		app.declareWinner(mat, 'Chong', 'DQ')
		break;
		
	case 'dqchong':
		app.declareWinner(mat, 'Hong', 'DQ')
		break;
	case 'wdhong':
		app.declareWinner(mat, 'Chong', 'Withdraw')
		break;
		
	case 'wdchong':
		app.declareWinner(mat, 'Hong', 'Withdraw')
		break;
		
	case 'undeclare':
		app.undeclareWinner(mat);
		break;
		
	case 'showscoreboard':
		if(!mat) {
			UI.alert('Cannot show score from this view', 'Silly Me')
		} else {
			if(!UI.wins.isWindow('scoreboardWindow')) UI.scoreboardWindow = UI.createScoreboardWindow(mat)
		}
		break;
		
	case 'showdevicelist':
		if(!mat) mat = null;
		if(!UI.wins.isWindow('devicesWindow')) UI.DeviceListWindow = UI.createDeviceListWindow(mat)
		break;	
		
	case 'setdevice_setup':
		app.registerDevice(ROLE.MASTER, null, app.registerDeviceResponse)
		break;
		
	case 'setdevice_monitor':
		app.registerDevice(ROLE.MONITOR, null, app.registerDeviceResponse)
		break;
		
		
	default:
		UI.alert('Not yet implemented', 'Damn!')
	}
}

var ROLE = {
	 	NA :			-1,
	 	MASTER : 		1,
	 	MONITOR : 		2,
	 	
	 	CONTROLLER : 	6,
	 	MOBILE_CONTROL:	7,
	 	RECORD_KEEPER : 8,
	 	
	 	SCOREBOARD: 	10,
	 	
	 	JUDGE1 : 		11,
	 	JUDGE2 : 		12,
	 	JUDGE3 : 		13,
	 	JUDGE4 : 		14
	 }
	 
	ROLE.title = []
	 ROLE.title[-1] = 'Unassigned';
	 ROLE.title[1] = 'Setup Master'
	 ROLE.title[2] = 'Global Records';
	 
	 ROLE.title[6] = 'Mat Controller';
	 ROLE.title[7] = 'Mobile Mat Controller';
	 ROLE.title[8] = 'Record Keeper';
	 ROLE.title[10] = 'Scoreboard';
	 ROLE.title[11] = 'Referee 1';
	 ROLE.title[12] = 'Referee 2';
	 ROLE.title[13] = 'Referee 3';
	 ROLE.title[14] = 'Referee 4';


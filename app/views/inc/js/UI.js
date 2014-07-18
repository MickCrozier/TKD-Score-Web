////
/*
This file generates various UI componements
*/
/////

UI = {}


//////////// MENUS

UI.createMenu = function(parentLayout, handler) {
	var menu = parentLayout.attachMenu();
	menu.attachEvent("onClick", handler);
	return menu;
}
	
UI.createFileMenu = function(parentMenu) {
	parentMenu.setIconsPath("images/icons/");
	parentMenu.addNewSibling(null, 'filemenu', 'File');
	parentMenu.addNewChild('filemenu', 1, 'reregister', 'Re-register Device', false);
	parentMenu.addNewSeparator('reregister', 'sep1');
	parentMenu.addNewChild('filemenu', 7, 'save', 'Save', false, 'save.gif', 'save+dis.gif');
	parentMenu.addNewChild('filemenu', 8, 'load', 'Load', false, 'open.gif', 'open_dis.gif');
	parentMenu.addNewSeparator('load', 'sep2');
	parentMenu.addNewChild('filemenu', 50, 'close', 'Close', false, 'close.gif', 'close_dis.gif');
}

UI.createSetupMenu = function(parentMenu) {
	parentMenu.setIconsPath("images/icons/");
	parentMenu.addNewSibling(null, 'setupmenu', 'Setup');
	parentMenu.addNewChild('setupmenu', 10, 'creatematch', 'Create Match');
	parentMenu.addNewChild('setupmenu', 9, 'createmat', 'Create Mat');
	//parentMenu.addNewSeparator('setupmenu', 'sep1');
}

UI.createEditMenu = function(parentMenu) {
	parentMenu.setIconsPath("images/icons/");
	parentMenu.addNewSibling(null, 'editmenu', 'Edit');
	//parentMenu.addNewChild('editmenu', 10, 'editmatch', 'Edit Match');
	parentMenu.addNewChild('editmenu', 9, 'editmat', 'Edit Mat');
	//parentMenu.addNewSeparator('editmat', 'sep1');
}


UI.createTimeMenu = function(parentMenu) {
	parentMenu.setIconsPath("images/icons/");
	parentMenu.addNewSibling(null, 'timemenu', 'Time');
	parentMenu.addNewChild('timemenu', 10, 'resetroundclock', 'Reset Round Clock');
	parentMenu.addNewChild('timemenu', 10, 'resetbreakclock', 'Reset Break Clock');
	parentMenu.addNewChild('timemenu', 10, 'resetinjuryclock', 'Reset Injury Clock');
	parentMenu.addNewSeparator('resetinjuryclock', 'sep1');
	parentMenu.addNewChild('timemenu', 10, 'roundup', 'Round +');
	parentMenu.addNewChild('timemenu', 10, 'rounddown', 'Round -');
	//parentMenu.addNewSeparator('rounddown', 'sep2');
	//parentMenu.addNewChild('timemenu', 10, 'resetmatch', 'Reset Match');
}

UI.createMatchMenu = function(parentMenu) {
	parentMenu.setIconsPath("images/icons/");
	parentMenu.addNewSibling(null, 'matchmenu', 'Match');

	parentMenu.addNewChild('matchmenu', 3, 'editmatch', 'New Match');
	parentMenu.addNewChild('matchmenu', 4, 'resetmatch', 'Reset Match');
	parentMenu.addNewSeparator('resetmatch', 'sep0');
	parentMenu.addNewChild('matchmenu', 5, 'dwhong', 'Declare Winner Hong');
	parentMenu.addNewChild('matchmenu', 6, 'dwchong', 'Declare Winner Chong');
	parentMenu.addNewSeparator('dwchong', 'sep1');
	parentMenu.addNewChild('matchmenu', 7, 'dqhong', 'Disqualify Hong');
	parentMenu.addNewChild('matchmenu', 8, 'dqchong', 'Disqualify Chong');
	parentMenu.addNewSeparator('dqchong', 'sep2');
	parentMenu.addNewChild('matchmenu', 9, 'wdhong', 'Withdraw Hong');
	parentMenu.addNewChild('matchmenu', 10, 'wdchong', 'Withdraw Chong');
	parentMenu.addNewSeparator('wdchong', 'sep3');
	parentMenu.addNewChild('matchmenu', 11, 'undeclare', 'Undeclare Winner');
}

UI.createMatViewMenu = function(parentMenu) {
	parentMenu.setIconsPath("images/icons/");
	parentMenu.addNewSibling(null, 'viewmenu', 'View');
	parentMenu.addNewChild('viewmenu', 5, 'showscoreboard', 'Scoreboard Window');
	parentMenu.addNewChild('viewmenu', 6, 'showdevicelist', 'Device List');
}

UI.createManageMenu = function(parentMenu) {
	parentMenu.setIconsPath("images/icons/");
	parentMenu.addNewSibling(null, 'managemenu', 'Manage');
	parentMenu.addNewChild('managemenu', 5, 'setdevice_setup', 'Master Setup');
	parentMenu.addNewChild('managemenu', 6, 'setdevice_monitor', 'Global Monitoring');
}

/////////////// WINDOWS
UI.initWindows = function() {
	UI.wins = new dhtmlXWindows()
}
UI.createScoreboardWindow = function(mat) {
	var win = UI.wins.createWindow({
		id:'scoreboardWindow',
		caption:'Scoreboard',
		showHeader:true,
		allowMove:true,
		allowPark:true,
		modal:false,
		width:700,
		height:400,
		x:450,
		y:200,
		
	});
	UI.wins.window('scoreboardWindow').attachURL('display.html?m=' + mat);
	
	return win;
}

UI.createDeviceListWindow = function(mat) {
	var win = UI.wins.createWindow({
		id:'devicesWindow',
		caption:'Device assigned to mat ' + mat,
		showHeader:true,
		allowMove:true,
		allowPark:true,
		modal:false,
		width:400,
		height:300,
		x:450,
		y:50,
		
	});
	UI.wins.window('devicesWindow').attachURL('devicelist.html?m=' + mat);
	
	return win;
}

UI.createMatchFormWindow = function(handler, settings) {
	var win = UI.wins.createWindow({
		id:'matchFormWindow',
		caption:'Match Setup',
		showHeader:true,
		allowMove:true,
		allowPark:true,
		modal:false,
		width:500,
		height:300,
		x:100,
		y:100,
		center:true
	});
	
	win.myForm = UI.createMatchForm('matchFormWindow', settings);
	win.myForm.attachEvent("onButtonClick", handler);
	return win;
}

UI.createMatFormWindow = function(handler, settings) {
	var win = UI.wins.createWindow({
		id:'matFormWindow',
		caption:'Mat Setup',
		showHeader:true,
		allowMove:true,
		allowPark:true,
		modal:false,
		width:500,
		height:300,
		x:100,
		y:100,
		center:true
	});
	
	win.myForm = UI.createMatForm('matFormWindow', settings);
	win.myForm.attachEvent("onButtonClick", handler);
	return win;
}


/////////////// FORMS

UI.createMatchForm = function(windowId, settings) {

	var saveName = 'saveMatch';
	if(!settings) {
		settings = {
			chongName:"",
			hongName:"",
			rounds:3,
			roundLength:90,
			breakLength:60,
			injuryLength:60,
		};
		saveName = 'saveNewMatch';
	}
	var formStructure = [
	    {type:"settings",position:"label-top"},
	    {type: "fieldset",name:"matchform", label: "Match Setup", list:[
	        {type: "input", name: "nameChong", label:"Chong Name:", value:settings.chongName},
	        {type: "input", name: "nameHong", label: "Hong Name:", value:settings.hongName},
	        {type:"button", name:saveName, width:60,offsetTop:2, value:"Save"}, 
	        {type:"button", name:"cancelMatch",width:60,offsetTop:10, value:"Cancel"},
	        {type:"newcolumn"},
	        {type:"input", name:"rounds", label:"Rounds:", value:settings.rounds},
	        {type:"input", name:"roundLength", label:"Round Length:", value:settings.roundLength},
	        {type:"input", name:"breakLength", label:"Break Length:", value:settings.breakLength},
	        {type:"input", name:"injuryLength", label:"Injury Length:", value:settings.injuryLength},
	        
	
	    ]}
	];
	
	
	var myForm = UI.wins.window(windowId).attachForm(formStructure);
	myForm.getData = function() {
		var data = {
			chongName:myForm.getItemValue('nameChong'),
       		hongName:myForm.getItemValue('nameHong'),
       		rounds:myForm.getItemValue('rounds'),
       		roundLength:myForm.getItemValue('roundLength'),
       		breakLength:myForm.getItemValue('breakLength'), 
       		injuryLength:myForm.getItemValue('injuryLength'),
		}
		return data;
	}
	
	return myForm;
}

UI.createMatForm = function(windowId, settings) {
	var saveName = "saveMat"
	if(!settings) {
		settings = {
			title:"",
			agree:1,
			scoreTimeout:700,
			
		};
		saveName = "saveNewMat"
	}
	
	
	var formStructure = [
	    {type:"settings",position:"label-top"},
	    {type: "fieldset",name:"matform", label: "Mat Setup", list:[
	        {type: "input", name: "title", label:"Mat Title:", value:settings.title},
	        {type: "input", name: "agree", label: "Refs Agree", value: settings.agree},
	        {type:"input", name:"scoretimeout", label:"Refs Wait Time (ms):", value:settings.scoreTimeout},
	        {type:"button", name:saveName, width:60,offsetTop:2, value:"Save"}, 
	        {type:"button", name:"cancelMat",width:60,offsetTop:10, value:"Cancel"},

	    ]}
	];
	
	
	var myForm = UI.wins.window(windowId).attachForm(formStructure);
	
	myForm.getData = function() {
		var data = {
			title: myForm.getItemValue('title'),
			agree: myForm.getItemValue('agree'),
			scoreTimeout: myForm.getItemValue('scoretimeout'),
		}
		return data;
	}
	
	
	return myForm;
}





///////////////// MISC
UI.alert = function(text, buttonText) {
	if(!buttonText) buttonText = "Ok"
	
	dhtmlx.alert({
	      type:"alert",
	      text:text,
	      title:'',
	      ok:buttonText
	});
}
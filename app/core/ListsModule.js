
'use strict';

/**
 * @ngdoc overview
 * @name tvur.lists
 * @requires restmod
 *
 * @description
 * Regular lists throughout the application are made available through this module
 */

var Module = angular.module('tvur.lists', [ 
    'bsol.session',
    'ui.bootstrap',
    'restmod',
])


/**
 * @ngdoc service
 * @name tvur.lists.service:ContactCategoryService
 * 
 * @description
 * Provides a list of Categories assignable to Contacts
 * 
 * Returns an array of objects representing the list
 * <pre>
 * {id:the_id, description:human_readable_text}
 * </pre>
*/
.service('ContactCategoryService', ['restmod', function($restmod){

    var LIST = [
        {id:'STAFF',  description:'Staff'},
        {id:'CONTRACTOR',  description:'Contractor'},
        {id:'COMPANY',  description:'Company'},
        {id:'CONTACT',  description:'Contact'},
    ];

    var s = {
        getList: function() {
            return LIST;
        },

        updateList: function() {
            LIST.$fetch();
        }
    };
    return s;
}])

/**

 * @ngdoc service
 * @name tvur.lists.service:UserRoleService
 * 
 * @description
 * Provides a list of Roles assignable to users
 *
 * returns array of objects representing the list
 * <pre>
 * {id:the_id, description:human_readable_text}
 * </pre>
*/
.service('UserRoleService', ['$restmod', function($restmod){

    var LIST = [
        {id:'SYSTEMDEV',  description:'Developer'},
        {id:'SUPPORT',  description:'System Support'},
        {id:'OPERATOR',  description:'Operator'},
        {id:'ADMIN',  description:'Admin'},
    ];

    var s = {
        getList: function() {
            return LIST;
        },

        updateList: function() {
            LIST.$fetch();
        }
    };
    return s;
}])

/**

 * @ngdoc service
 * @name tvur.lists.service:CommTypeService
 * 
 * @description
 * Provides a list of types of communication
 *
 * returns array of objects representing the list
 * <pre>
 * {id:the_id, description:human_readable_text}
 * </pre>
*/
.service('CommTypeService', [function(){

    var LIST = [
        {id:'PHONE',  description:'Phone', icon: 'glyphicon glyphicon-earphone'},
        {id:'EMAIL',  description:'Email', icon: 'glyphicon glyphicon-envelope'},
        {id:'MEETING',  description:'Meeting', icon: 'glyphicon glyphicon-briefcase'},
        {id:'SITE',  description:'Site Visit', icon: 'glyphicon glyphicon-tower'},
    ];
    var s = {
        getList: function() {
            return LIST;
        },

        updateList: function() {
            LIST.$fetch();
        }
    };
    return s;
}])

/**
 * @ngdoc service
 * @name tvur.lists.service:CommCategoryService
 * 
 * @description
 * Provides a list of types of communication
 *
 * returns service managing the list
 * <pre>
 * Service.getList();
 * // returns
 * {id:the_id, description:human_readable_text}
 * </pre>
*/
.service('CommCategoryService', [function(){

    var LIST = [
        {id:'1',  description:'Accounts', icon: ''},
        {id:'2',  description:'General', icon: ''},
        {id:'3',  description:'Production', icon: ''},
        {id:'4',  description:'Ticketing', icon: ''},
    ];

    var s = {
        getList: function() {
            return LIST;
        },

        updateList: function() {
            LIST.$fetch();
        }
    }
    return s;
}])


/**
 * @ngdoc service
 * @name tvur.lists.service:CommCategoryService
 * 
 * @description
 * Provides a list of types of communication
 *
 * returns service managing the list
 * <pre>
 * Service.getList();
 * // returns
 * {id:the_id, description:human_readable_text}
 * </pre>
*/
.service('StaffRoleService', [function(){

    var LIST = [
        {id:'1',  description:'MXSU', icon: ''},
        {id:'2',  description:'MXST', icon: ''},
        {id:'3',  description:'MXGH', icon: ''},
        {id:'4',  description:'LXSU', icon: ''},
        {id:'5',  description:'LXST', icon: ''},
        {id:'6',  description:'LXGH', icon: ''},
        {id:'7',  description:'SXSU', icon: ''},
        {id:'8',  description:'SXST', icon: ''},
        {id:'9',  description:'SXGH', icon: ''},
        {id:'10',  description:'SMSU', icon: ''},
        {id:'11',  description:'SMST', icon: ''},
        {id:'12',  description:'SMGH', icon: ''},
        {id:'13',  description:'PMSU', icon: ''},
        {id:'14',  description:'PMST', icon: ''},
        {id:'15',  description:'PMGH', icon: ''},
    ];

    var s = {
        getList: function() {
            return LIST;
        },

        updateList: function() {
            LIST.$fetch();
        }
    }
    return s;
}])

/**
 * @ngdoc service
 * @name tvur.lists.service:CommCategoryService
 * 
 * @description
 * Provides a list of types of communication
 *
 * returns service managing the list
 * <pre>
 * Service.getList();
 * // returns
 * {id:the_id, description:human_readable_text}
 * </pre>
*/
.service('StaffPositionService', [function(){

    var LIST = [
        {id:'1',  description:'MX', icon: ''},
        {id:'2',  description:'LX', icon: ''},
        {id:'3',  description:'SX', icon: ''},
        {id:'4',  description:'HT', icon: ''},
        {id:'5',  description:'PM', icon: ''},
        {id:'6',  description:'SM', icon: ''},
    ];

    var s = {
        getList: function() {
            return LIST;
        },

        updateList: function() {
            LIST.$fetch();
        }
    }
    return s;
}])

/**
 * @ngdoc service
 * @name tvur.lists.service:StaffListService
 * 
 * @description
 * Provides a list of types of communication
 *
 * returns service managing the list
 * <pre>
 * Service.getList();
 * // returns
 * {id:the_id, description:human_readable_text}
 * </pre>
*/
.service('StaffListService', ['Contact', function(Contact){

    var LIST = Contact.$search({category: 'STAFF'});

    var updateList = function() {
        LIST.$fetch();
    }

    var s = {
        getList: function() {
            return LIST;
        },

        updateList: function() {
            LIST.$fetch();
        }
    }
    return s;
}])

/**
 * @ngdoc service
 * @name tvur.lists.service:CommCategoryService
 * 
 * @description
 * Provides a list of types of communication
 *
 * returns service managing the list
 * <pre>
 * Service.getList();
 * // returns
 * {id:the_id, description:human_readable_text}
 * </pre>
*/
.service('DateStatusListService', [function(){

    var LIST = [
        {id:'1',  description:'1st Pencil', icon: '', color:'', background:''},
        {id:'2',  description:'2nd Pencil', icon: '', color:'', background:''},
        {id:'3',  description:'3rd Pencil', icon: '', color:'', background:''},
        {id:'4',  description:'Awaiting Contract', icon: '', color:'', background:''},
        {id:'5',  description:'Confirmed', icon: '', color:'', background:''},
        {id:'6',  description:'Cancelled', icon: '', color:'', background:''},
    ];



    var s = {
        getList: function() {
            return LIST;
        },

        updateList: function() {
            LIST.$fetch();
        }
    }
    return s;
}]);



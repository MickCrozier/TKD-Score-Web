(function() {
	'use strict';

describe('RestFactory', function () {
	var mockData;


  // load the controller's module
  beforeEach(module('bs.common'));

  var RestFactory, DataService, $httpBackend;

  describe('Basic Test Service', function(){

    beforeEach(inject(function (_RestFactory_, _$httpBackend_) {
      RestFactory = _RestFactory_;
      $httpBackend = _$httpBackend_;

      DataService = new RestFactory({path:'test'});
      mockData = [
    		DataService.generateNew({_id: 0, name: 'Fred'}),
    		DataService.generateNew({_id: 1, name: 'Larry'}),
    		DataService.generateNew({_id: 2, name: 'Moe'}),
    		DataService.generateNew({_id: 3, name: 'John'})
    	];
    }));


    it('it should find a list', function(done) {
      $httpBackend.expect('GET', '/api/test')
      .respond(200, mockData);

      DataService.findList().then(function success(data){
      	expect(data.length).toBe(4);
        expect(data[0].name).toBe('Fred');
        done();
      }, function error(err) {
        throw new Error(JSON.stringify(err));
      });
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });


    it('it should find an item', function(done) {
      $httpBackend.expect('GET', '/api/test/2')
      .respond(200, mockData[2]);

      DataService.find(2).then(function success(data){
        expect(data.name).toBe('Moe');
        done();
      }, function error(err) {
      	throw new Error(JSON.stringify(err));
      });
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });


    it('it should create an item', function(done) {
      $httpBackend.expect('POST', '/api/test')
      .respond(200, {_id: 4, name: 'Groucho'});

      DataService.create({name: 'Groucho'}).then(function success(data){
        expect(data.name).toBe('Groucho');
        done();
      }, function error(err) {
        throw new Error(JSON.stringify(err));
      });

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

 
  });

});

})();
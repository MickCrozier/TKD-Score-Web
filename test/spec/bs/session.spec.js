'use strict';

xdescribe('bsol.session', function () {

  // load the controller's module
  beforeEach(module('bsol.session'));

  var fakeSession = {
    session: {
      authority:{canBeSeen: true},
      user: {}
    }
  };

  var SessionService, $httpBackend;

  describe('SessionService', function(){

    beforeEach(inject(function (_SessionService_, _$httpBackend_) {
      SessionService = _SessionService_;
      $httpBackend = _$httpBackend_;

    }));

    it('should be injected', function () {
      expect(typeof(SessionService.session)).toEqual('object');
    });


    it('should login successfully', function(done) {
      

      $httpBackend.expect('POST', '/api/login')
        .respond(200, {session: fakeSession});

      SessionService.login('tester', 'pass').then(function(data) {
        expect(data.session.authority.canBeSeen).toBeTruthy();
        done();
      });

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      
    });

    it('should get login status', function(done) {
      $httpBackend.expect('GET', '/api/login')
        .respond(200, {session: fakeSession});

      SessionService.status().then(function(data) {
        expect(data.session.authority.canBeSeen).toBeTruthy(); 
        done();
      });

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      
    });



   
  });

});

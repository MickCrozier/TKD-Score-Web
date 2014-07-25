(function() {
'use strict';


var mockMatchList = [
  {player1: 'testPlayer'}
];

describe('Match', function () {

  // load the controller's module
  beforeEach(module('tkdApp.match'));

  var MatchService, $httpBackend;

  describe('MatchService', function(){

    beforeEach(inject(function (_MatchService_, _$httpBackend_) {
      MatchService = _MatchService_;
      $httpBackend = _$httpBackend_;

    }));


    it('should get a list of Matches', function(done) {
      $httpBackend.expect('GET', '/api/Match')
      .respond(200, mockMatchList);

      MatchService.findList().then(function success(data){
        expect(data[0].player1).toBe('testPlayer');
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

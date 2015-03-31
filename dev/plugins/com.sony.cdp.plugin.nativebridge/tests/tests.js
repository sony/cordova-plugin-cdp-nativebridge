
exports.defineAutoTests = function() {
  describe('NativeBridge object existance check', function() {

    it("com.sony.cdp.plugin.nativebridge", function () {
      expect( com.sony.cdp.plugin.nativebridge).toBeDefined();
    });

    it("com.sony.cdp.plugin.nativebridge.coolMethod", function() {
      expect( com.sony.cdp.plugin.nativebridge.coolMethod ).toBeDefined();
    });
  });

  describe('coolMethod call test', function() {

    var value;
    var callbacks;

    beforeEach(function(done) {
      callbacks = {
        win: function(arg){
          value = arg;
          done();
        },
        fail: function(err){
          console.log("callbacks.fail");
          done();
        }
      };

      spyOn(callbacks, 'win').and.callThrough();
      spyOn(callbacks, 'fail').and.callThrough();
      
      com.sony.cdp.plugin.nativebridge.coolMethod("test", callbacks.win, callbacks.fail);
    });

    it("to have been called", function() {
      expect(callbacks.win).toHaveBeenCalled();
    });

    it("check return value", function() {
      expect(value).toBe("test");
    });

  });
};

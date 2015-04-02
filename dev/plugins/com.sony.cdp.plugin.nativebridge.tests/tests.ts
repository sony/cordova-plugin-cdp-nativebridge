/// <reference path="../../app/modules/include/jasmine.d.ts" />
/// <reference path="../../app/modules/include/cordova.d.ts" />
/// <reference path="../../app/plugins/com.sony.cdp.plugin.nativebridge/www/cdp.plugin.nativebridge.d.ts" />


declare var exports: any;

exports.defineAutoTests = function () {

	var makeArgs = CDP.Plugin.NativeBridge.makeArgsInfo;

	describe("NativeBridge object existance check", () => {
		it("CDP.Plugin.NativeBridge", () => {
			expect(CDP.Plugin.NativeBridge).toBeDefined();
		});
	});

	describe("NativeBridge instance check", () => {
		it("can new CDP.Plugin.NativeBridge", function () {
			var instance = new CDP.Plugin.NativeBridge({
				name: "Hoge",
				android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
				ios: { packageInfo: "CDVNBHoge" }
			});
			expect(instance).not.toBeNull();
		});

		it("different instance", function () {
			var inst1: any = new CDP.Plugin.NativeBridge({
				name: "Hoge",
				android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
				ios: { packageInfo: "CDVNBHoge" }
			});
			var inst2: any = new CDP.Plugin.NativeBridge({
				name: "Hoge",
				android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
				ios: { packageInfo: "CDVNBHoge" }
			});
			expect(inst1).not.toBeNull();
			expect(inst1._objectId).toBeDefined();
			expect(inst2).not.toBeNull();
			expect(inst2._objectId).toBeDefined();
			expect(inst1._objectId).not.toEqual(inst2._objectId);
		});
	});

	describe("Class not found check",() => {
		var value;
		var callbacks;

		beforeEach((done) => {
			callbacks = {
				win: (arg) => {
					value = arg;
					done();
				},
				fail: (err) => {
					console.log("callbacks.fail");
					done();
				}
			};

			spyOn(callbacks, 'win').and.callThrough();
			spyOn(callbacks, 'fail').and.callThrough();

			var instance = new CDP.Plugin.NativeBridge({
				name: "Hoge",
				android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
				ios: { packageInfo: "CDVNBHoge" }
			});

			instance.exec(callbacks.win, callbacks.fail, "foo", makeArgs(1, null, "test"));
		});

		it("to have been called", () => {
			expect(callbacks.win).not.toHaveBeenCalled();
			expect(callbacks.fail).toHaveBeenCalled();
		});

		it("check return value", () => {
			expect(value).toBe("test");
		});
	});

	/*
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
	*/
};

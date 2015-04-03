/// <reference path="../../app/modules/include/jasmine.d.ts" />
/// <reference path="../../app/modules/include/cordova.d.ts" />
/// <reference path="../../app/plugins/com.sony.cdp.plugin.nativebridge/www/cdp.plugin.nativebridge.d.ts" />


declare var exports: any;

import NativeBridge = CDP.Plugin.NativeBridge;
import makeArgs = CDP.Plugin.NativeBridge.makeArgsInfo;

exports.defineAutoTests = function () {
/*
	describe("NativeBridge object existance check", () => {
		it("CDP.Plugin.NativeBridge", () => {
			expect(CDP.Plugin.NativeBridge).toBeDefined();
		});
	});

	describe("NativeBridge instance check", () => {
		it("can new NativeBridge", function () {
			var instance = new NativeBridge({
				name: "Hoge",
				android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
				ios: { packageInfo: "CDVNBHoge" }
			});
			expect(instance).not.toBeNull();
		});

		it("different instance", function () {
			var inst1: any = new NativeBridge({
				name: "Hoge",
				android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
				ios: { packageInfo: "CDVNBHoge" }
			});
			var inst2: any = new NativeBridge({
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
		var value: NativeBridge.IResult;
		var taskId: string;
		var callbacks;

		beforeEach((done) => {
			callbacks = {
				win: (arg) => {
					done();
				},
				fail: (err) => {
					value = err;
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

			taskId = instance.exec(callbacks.win, callbacks.fail, "foo", makeArgs(1, null, "test"));
		});

		it("to have been called", () => {
			expect(callbacks.win).not.toHaveBeenCalled();
			expect(callbacks.fail).toHaveBeenCalled();
		});

		it("check return value", () => {
			expect(value).toBeDefined();
			expect(value.code).toBe(NativeBridge.ERROR_CLASS_NOT_FOUND);
			expect(value.message).toBe("[CDP.Plugin][Native][BridgeManager] class not found. class: com.sony.cdp.nativebridge.cordova.Hoge");
			expect(value.taskId).toBe(taskId);
		});
	});
*/
	describe("Method check",() => {
		var value: NativeBridge.IResult;
		var taskId: string;
		var callbacks;

		beforeEach((done) => {
			callbacks = {
				win: (arg) => {
					done();
				},
				fail: (err) => {
					done();
				}
			};

			spyOn(callbacks, 'win').and.callThrough();
			spyOn(callbacks, 'fail').and.callThrough();

			var instance = new CDP.Plugin.NativeBridge({
				name: "SimpleBridge",
				android: { packageInfo: "com.sony.cdp.sample.SimpleBridge" },
				ios: { packageInfo: "CDVNBSimpleBridge" }
			});

			taskId = instance.exec(callbacks.win, callbacks.fail, "coolMethod", makeArgs(1, false, "test", { ok: true }));
		});

		it("to have been called",() => {
			expect(callbacks.win).toHaveBeenCalled();
			expect(callbacks.fail).not.toHaveBeenCalled();
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

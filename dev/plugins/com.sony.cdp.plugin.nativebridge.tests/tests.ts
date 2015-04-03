/// <reference path="../../app/modules/include/jasmine.d.ts" />
/// <reference path="../../app/modules/include/cordova.d.ts" />
/// <reference path="../../app/plugins/com.sony.cdp.plugin.nativebridge/www/cdp.plugin.nativebridge.d.ts" />


declare var exports: any;

import NativeBridge = CDP.Plugin.NativeBridge;

exports.defineAutoTests = function () {

	describe("NativeBridge object existance check",() => {
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

			taskId = instance.exec(callbacks.win, callbacks.fail, "foo", [1, null, "test"]);
		});

		it("to have been called", () => {
			expect(callbacks.win).not.toHaveBeenCalled();
			expect(callbacks.fail).toHaveBeenCalled();
		});

		it("check return value", () => {
			expect(value).toBeDefined();
			expect(value.code).toBe(NativeBridge.ERROR_CLASS_NOT_FOUND);
			expect(value.message).toBe("[com.sony.cdp.plugin.nativebridge][Native][BridgeManager] class not found. class: com.sony.cdp.nativebridge.cordova.Hoge");
			expect(value.taskId).toBe(taskId);
		});
	});

	describe("Simple method call check",() => {
		var value: NativeBridge.IResult;
		var taskId: string;
		var callbacks;

		beforeEach((done) => {
			callbacks = {
				win: (arg) => {
					value = arg;
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

			taskId = instance.exec(callbacks.win, callbacks.fail, "coolMethod", [1, false, "test", { ok: true }]);
		});

		it("to have been called",() => {
			expect(callbacks.win).toHaveBeenCalled();
			expect(callbacks.fail).not.toHaveBeenCalled();
		});

		it("check return value",() => {
			expect(value).toBeDefined();
			expect(value.code).toBe(NativeBridge.SUCCESS_OK);
			expect(value.message).not.toBeDefined();
			expect(value.taskId).toBe(taskId);
			expect(value.params).toBeDefined();
			expect(value.params.length).toBe(1);
			expect(value.params[0]).toBe("arg1: 1, arg2: false, arg3: test, “ú–{Œê‚ÅOK: true");
		});
	});
};

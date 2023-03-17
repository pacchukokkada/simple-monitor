const {assert} = require('chai');
const {batteryIsOk, refreshBatteryCondition} = require('../bms-monitor');

function check(temp, soc, chargeRate, unit) {
  const batteryStatus = {
    'temperature': temp,
    'stateOfCharge': soc,
    'chargeRate': chargeRate,
  };
  return batteryIsOk(batteryStatus, unit);
}

function test() {
  let batteryCondition = {};
  refreshBatteryCondition();
  describe('checking battery status', () => {
    it('battery status should be ok', () => {
      batteryCondition = check(25, 70, 0.7, 'celsius');
      assert.equal(batteryCondition.isGood, true);
      refreshBatteryCondition();
    });
    it('should not be any breach or warning', () => {
      assert.equal(batteryCondition.breach.temperature.length, 0);
      assert.equal(batteryCondition.breach.stateOfCharge.length, 0);
      assert.equal(batteryCondition.breach.chargeRate.length, 0);

      assert.equal(batteryCondition.warning.temperature.length, 0);
      assert.equal(batteryCondition.warning.stateOfCharge.length, 0);
      assert.equal(batteryCondition.warning.chargeRate.length, 0);
      refreshBatteryCondition();
    });
    it('should be able convert gahrenheit to celsius and should be warning', () => {
      batteryCondition = check(113, 80, 0.8, 'fahrenheit');
      assert.equal(batteryCondition.isGood, true);
      assert.notEqual(batteryCondition.warning.temperature.length, 0);
      assert.notEqual(batteryCondition.warning.stateOfCharge.length, 0);
      assert.notEqual(batteryCondition.warning.chargeRate.length, 0);
      refreshBatteryCondition();
    });

    it('battery status should be ok', () => {
      batteryCondition = check(0, 20, 0);
      assert.equal(batteryCondition.isGood, true);
      refreshBatteryCondition();
    });

    it('battery status should not be ok, should be breach in temperature', () => {
      batteryCondition = check(50, 70, 0.2, 'celsius');
      assert.equal(batteryCondition.isGood, false);
      assert.notEqual(batteryCondition.breach.temperature.Length, 0);
      refreshBatteryCondition();
    });
    it('battery status should not be ok, should be breach in temperature', () => {
      batteryCondition = check(-10, 60, 0.6, 'celsius');
      assert.equal(batteryCondition.isGood, false);
      assert.notEqual(batteryCondition.breach.temperature.length, 0);
      assert.equal(batteryCondition.breach.stateOfCharge.length, 0);
      assert.equal(batteryCondition.breach.chargeRate.length, 0);
      refreshBatteryCondition();
    });
    it('battery status should not be ok, all factor is breached', () => {
      batteryCondition = check(57, 100, 0.99, 'celsius');
      assert.notEqual(batteryCondition.breach.temperature.length, 0);
      assert.notEqual(batteryCondition.breach.stateOfCharge.length, 0);
      assert.notEqual(batteryCondition.breach.chargeRate.length, 0);
      // testing whether the error msg contains factor names
      assert.equal(batteryCondition.breach.temperature.includes('TEMPERATURE'), true);
      assert.equal(batteryCondition.breach.stateOfCharge.includes('SOC'), true);
      assert.equal(batteryCondition.breach.chargeRate.includes('CHARGE_RATE'), true);
      refreshBatteryCondition();
    });
    it('battery status should be ok and no warning or breach', () => {
      assert.equal(batteryCondition.isGood, true);
      assert.equal(batteryCondition.breach.temperature.length, 0);
      assert.equal(batteryCondition.breach.stateOfCharge.length, 0);
      assert.equal(batteryCondition.breach.chargeRate.length, 0);
      assert.equal(batteryCondition.warning.temperature.length, 0);
      assert.equal(batteryCondition.warning.stateOfCharge.length, 0);
      assert.equal(batteryCondition.warning.chargeRate.length, 0);
    });
    it('battery status should not be ok, all factor breached but not warnings', () => {
      batteryCondition = check(-4, 13, -0.2, 'celsius');
      assert.notEqual(batteryCondition.breach.temperature.length, 0);
      assert.notEqual(batteryCondition.breach.stateOfCharge.length, 0);
      assert.notEqual(batteryCondition.breach.chargeRate.length, 0);
      refreshBatteryCondition();
    });
    it('there should be warning', () => {
      batteryCondition = check(2.25, 24.00, 0.04, 'celsius');
      assert.notEqual(batteryCondition.warning.temperature.length, 0);
      assert.notEqual(batteryCondition.warning.stateOfCharge.length, 0);
      assert.notEqual(batteryCondition.warning.chargeRate.length, 0);
    });
    it('there should be warning', () => {
      batteryCondition = check(42.75, 76.00, 0.76, 'celsius');
      assert.notEqual(batteryCondition.warning.temperature.length, 0);
      assert.notEqual(batteryCondition.warning.stateOfCharge.length, 0);
      assert.notEqual(batteryCondition.warning.chargeRate.length, 0);
    });
  });
}

test();

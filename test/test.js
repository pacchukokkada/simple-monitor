const {expect, assert} = require('chai');
const {batteryIsOk, getErrorMsg} = require('../bms-monitor');

function check(temp, soc, chargeRate) {
  const batteryStatus = {
    'temperature': temp,
    'stateOfCharge': soc,
    'chargeRate': chargeRate,
  };
  return batteryIsOk(batteryStatus);
}

function test() {
  describe('checking battery status', () => {
    it('battery status should be ok', () => {
      // expect(check(25, 70, 0.7)).to.be.true;
      assert.equal(check(25, 70, 0.7), true);
      assert.equal(getErrorMsg(), 'Battery Condition is Good');
    });
    it('battery status should be ok', () => {
      // expect(check(45, 80, 0.8)).to.be.true;
      assert.equal(check(45, 80, 0.8), true);
      assert.equal(getErrorMsg(), 'Battery Condition is Good');
    });
    it('battery status should be ok', () => {
      // expect(check(0, 20, 0)).to.be.true;
      assert.equal(check(0, 20, 0), true);
      assert.equal(getErrorMsg(), 'Battery Condition is Good');
    });
    it('battery status should not be ok, temperature is high', () => {
      // expect(check(50, 70, 0.2)).to.be.false;
      assert.equal(check(50, 70, 0.2), false);
      assert.equal(getErrorMsg(), 'temperature is too high (50°C)');
    });
    it('battery status should not be ok, temperature is low', () => {
      // expect(check(-10, 60, 0.6)).to.be.false;
      assert.equal(check(-10, 60, 0.6), false);
      assert.equal(getErrorMsg(), 'temperature is too low (-10°C)');
    });
    it('battery status should not be ok, soc is high', () => {
      expect(check(30, 100, 0.4)).to.be.false;
      assert.equal(getErrorMsg(), 'state of charge is too high (100%)');
    });
    it('battery status should not be ok, soc is low', () => {
      expect(check(20, 10, 0.2)).to.be.false;
      assert.equal(getErrorMsg(), 'state of charge is too low (10%)');
    });
    it('battery status should not be ok, charge-rate is high', () => {
      expect(check(25, 35, 1.2)).to.be.false;
      assert.equal(getErrorMsg(), 'charge rate is too high (1.2C)');
    });
    it('battery status should not be ok, charge-rate is low', () => {
      expect(check(40, 80, -0.81)).to.be.false;
      assert.equal(getErrorMsg(), 'charge rate is too low (-0.81C)');
    });
    it('battery status should not be ok, temperature and soc is high', () => {
      expect(check(55, 90, 0.6)).to.be.false;
    });
    it('battery status should not be ok, temperature and soc is low', () => {
      expect(check(-3, 16, 0.6)).to.be.false;
    });
    it('battery status should not be ok,soc and charge-rate is high', () => {
      expect(check(35, 90, 0.95)).to.be.false;
    });
    it('battery status should not be ok, soc and charge-rate is low', () => {
      expect(check(28, 14, -0.8)).to.be.false;
    });
    it('battery status should not be ok, all factors out of range', () => {
      expect(check(60, 19, 0.92)).to.be.false;
    });
  });
}

test();

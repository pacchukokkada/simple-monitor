const {expect} = require('chai');
const {batteryIsOk} = require('../bms-monitor');

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
      expect(check(25, 70, 0.7)).to.be.true;
    });
    it('battery status should not be ok, temperature is high', () => {
      expect(check(50, 70, 0.2)).to.be.false;
    });
    it('battery status should not be ok, temperature is low', () => {
      expect(check(-10, 60, 0.6)).to.be.false;
    });
    it('battery status should not be ok, soc is high', () => {
      expect(check(30, 100, 0.4)).to.be.false;
    });
    it('battery status should not be ok, soc is low', () => {
      expect(check(20, 10, 0.2)).to.be.false;
    });
    it('battery status should not be ok, charge rate is high', () => {
      expect(check(25, 35, 1.2)).to.be.false;
    });
    it('battery status should not be ok, temperature is low', () => {
      expect(check(40, 80, -0.81)).to.be.false;
    });
    it('battery status should not be ok', () => {
      expect(check(60, 19, 0.92)).to.be.false;
    });
  });
}

test();

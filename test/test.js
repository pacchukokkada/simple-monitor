const {expect} = require('chai');
const {batteryIsOk, checkForBreach, checkForWarning} = require('../bms-monitor');

function test() {
  describe('checking checkForWarning and checkForBreach', () => {
    it('should retrun warning', () =>{
      expect(checkForWarning('temperature', 45).length).not.equal(0);
      expect(checkForWarning('stateOfCharge', 76).length).not.equal(0);
      expect(checkForWarning('chargeRate', 0.04).length).not.equal(0);
    });
    it('should not retrun warning', () =>{
      expect(checkForWarning('temperature', 42).length).equal(0);
      expect(checkForWarning('stateOfCharge', 25).length).equal(0);
      expect(checkForWarning('chargeRate', 0.7).length).equal(0);
    });
    it('should  retrun breach', () =>{
      expect(checkForBreach('temperature', 55).length).not.equal(0);
      expect(checkForBreach('stateOfCharge', 10).length).not.equal(0);
      expect(checkForBreach('chargeRate', -0.1).length).not.equal(0);
    });
    it('should not retrun breach', () =>{
      expect(checkForBreach('temperature', 45).length).equal(0);
      expect(checkForBreach('stateOfCharge', 20).length).equal(0);
    });
  });
  describe('checking the breach  msg', () => {
    it('breach msg shoudl contain factor name', () => {
      expect(checkForBreach('temperature', 55).includes('TEMPERATURE')).equal(true);
      expect(checkForBreach('stateOfCharge', 10).includes('SOC')).equal(true);
      expect(checkForBreach('chargeRate', -0.1).includes('CHARGE_RATE')).equal(true);
    });
  });
  describe('checking batterIsOk and unitConverter', () => {
    it('battery condition ok, should not return any wanring or breach', () => {
      const condition = batteryIsOk({
        temperature: 86,
        stateOfCharge: 40,
        chargeRate: 0.6,
      }, 'fahrenheit');
      expect(condition['isOk']).equal(true);
      expect(condition['warning']['temperature'].length).equal(0);
    });

    it('battery condition not be ok, should return any wanring or breach', () => {
      const condition = batteryIsOk({
        temperature: 50,
        stateOfCharge: 19,
        chargeRate: 0.6,
      }, 'celsius');
      expect(condition['isOk']).equal(false);
      expect(condition['breach']['temperature'].length).not.equal(0);
    });
  });
}

test();

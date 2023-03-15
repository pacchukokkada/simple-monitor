const factors = {
  'temperature': {'name': 'temperature', 'max': 45, 'min': 0, 'unit': '°C'},
  'stateOfCharge': {'name': 'state of charge', 'max': 80, 'min': 20, 'unit': '%'},
  'chargeRate': {'name': 'charge rate', 'max': 0.8, 'min': 0, 'unit': 'C'},
};
let errorMsg = 'Battery Condition is Good';

function checkBattery(factor, currentValue) {

  if (currentValue > factors[factor].max) {
    errorMsg = `${factors[factor].name} is too high (${currentValue}${factors[factor].unit})`;
    console.log(errorMsg);
    return false;
  } else if (currentValue < factors[factor].min ) {
    errorMsg = `${factors[factor].name} is too low (${currentValue}${factors[factor].unit})`;
    console.log(errorMsg);
    return false;
  }
  return true;
}


function batteryIsOk(currentBatteryStatus) {
  const isBatteryOk = Object.entries(currentBatteryStatus).
      every(([key, value]) => checkBattery(key, value));
  return isBatteryOk;
}

function getErrorMsg() {
  return errorMsg;
}

module.exports = {
  batteryIsOk,
  getErrorMsg,
};

// https://github.com/numocityadmin/nodejs-template

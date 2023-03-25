const {convertToCelcius} = require('./unitConverter');
const factors = {
  'temperature': {'name': 'TEMPERATURE', 'max': 45, 'min': 0},
  'stateOfCharge': {'name': 'SOC', 'max': 80, 'min': 20},
  'chargeRate': {'name': 'CHARGE_RATE', 'max': 0.8, 'min': 0},
};
const tolerance = 0.05;

function checkForWarning(factor, currentValue) {
  if (currentValue >= (factors[factor].max - factors[factor].max*tolerance).toFixed(2)) {
    return `HIGH_${factors[factor].name}_WARNING`;
  } else if (currentValue <= (factors[factor].min + factors[factor].max*tolerance).toFixed(2)) {
    return `LOW_${factors[factor].name}_WARNING`;
  }
  return '';
}

function checkForBreach(factor, currentValue) {
  if (currentValue > factors[factor].max) {
    return `HIGH_${factors[factor].name}_BREACH`;
  } else if (currentValue < factors[factor].min ) {
    return `LOW_${factors[factor].name}_BREACH`;
  } else {
    return '';
  }
}

function checkIsOk(condition) {
  const breachs = Object.values(condition);
  for (let i=0; i<breachs.length; i++) {
    if (breachs[i] != '') {
      return false;
    }
  }
  return true;
}

function batteryIsOk(currentBatteryStatus, unit) {
  const temperatureValue = currentBatteryStatus.temperature;
  currentBatteryStatus.temperature = convertToCelcius(temperatureValue, unit);
  const breach = {};
  const warning = {};
  const factors = Object.keys(currentBatteryStatus);
  for (let i=0; i<factors.length; i++) {
    const res = checkForBreach(factors[i], currentBatteryStatus[factors[i]]);
    breach[factors[i]] = res;
  }
  for (let i=0; i<factors.length; i++) {
    const res = checkForWarning(factors[i], currentBatteryStatus[factors[i]]);
    warning[factors[i]] = res;
  }
  const isOk = checkIsOk(breach);
  const batteryCondtion = {'isOk': isOk, breach, warning};
  return batteryCondtion;
}

module.exports = {
  batteryIsOk,
  checkForBreach,
  checkForWarning,
};

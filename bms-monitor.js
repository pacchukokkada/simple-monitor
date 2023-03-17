const {convertToCelcius} = require('./unitConverter');
const factors = {
  'temperature': {'name': 'TEMPERATURE', 'max': 45, 'min': 0},
  'stateOfCharge': {'name': 'SOC', 'max': 80, 'min': 20},
  'chargeRate': {'name': 'CHARGE_RATE', 'max': 0.8, 'min': 0},
};
const tolerance = 0.05;
const batteryCondtion = {
  'breach': {},
  'warning': {},
};

function refreshBatteryCondition() {
  batteryCondtion['isGood'] = true;
  Object.keys(factors).forEach((key) => {
    batteryCondtion['breach'][key] = '';
  });
  Object.keys(factors).forEach((key) => {
    batteryCondtion['warning'][key] = '';
  });
}

function checkForWarning(factor, currentValue) {
  if (currentValue >= (factors[factor].max - factors[factor].max/tolerance).toFixed(2)) {
    batteryCondtion['warning'][factor] = `HIGH_${factors[factor].name}_WARNING`;
    console.log((factors[factor].max - factors[factor].max/tolerance).toFixed(2));
  } else if (currentValue <= (factors[factor].min + factors[factor].max/tolerance).toFixed(2)) {
    batteryCondtion['warning'][factor] = `LOW_${factors[factor].name}_WARNING`;
    console.log((factors[factor].min + factors[factor].max/tolerance).toFixed(2));
  }
}
function checkForBreach(factor, currentValue) {
  if (currentValue > factors[factor].max) {
    batteryCondtion['breach'][factor] = `HIGH_${factors[factor].name}_BREACH`;
    batteryCondtion['isGood'] = false;
  } else if (currentValue < factors[factor].min ) {
    batteryCondtion['breach'][factor] = `LOW_${factors[factor].name}_BREACH`;
    batteryCondtion['isGood'] = false;
  } else {
    checkForWarning(factor, currentValue);
  }
}
function batteryIsOk(currentBatteryStatus, unit) {
  const temperatureValue = currentBatteryStatus.temperature;
  // converting temperature to celsius
  currentBatteryStatus.temperature = convertToCelcius(temperatureValue, unit);

  Object.entries(currentBatteryStatus).
      forEach(([key, value]) => checkForBreach(key, value));
  return batteryCondtion;
}
module.exports = {
  batteryIsOk,
  refreshBatteryCondition,
};

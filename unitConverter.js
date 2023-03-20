
function convertToCelcius(value, unit) {
  if (unit == 'fahrenheit') {
    return (value-32)*(5/9);
  }
  return value;
}
module.exports = {convertToCelcius};

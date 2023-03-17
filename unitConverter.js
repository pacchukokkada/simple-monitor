
function convertToCelcius(value, unit) {
  if (unit == 'celsius') {
    return value;
  } else if (unit == 'fahrenheit') {
    return (value-32)*(5/9);
  }
}
module.exports = {convertToCelcius};

const isValidDate = (value: any): value is Date => {
  const date = new Date(value);
  return value && date.toString() !== 'Invalid Date';
}

const isValidString = (value: any): value is string => {
  return value && typeof value === 'string';
}

const isValidText = (value: any, minLength = 1): value is string => {
  return isValidString(value) && value.trim().length >= minLength;
}

const isValidImageUrl = (value: any): value is string => {
  return isValidString(value) && (value.startsWith('http://') || value.startsWith('https://'));
}

const isValidEmail = (value: any): value is string => {
  return isValidString(value) && value.includes('@');
}

export {isValidDate, isValidText, isValidImageUrl, isValidEmail};
//email validations and checking if null
const validateEmail = (value) => {
  var regex = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );
  if (value) {
    if (!regex.test(value)) {
      return "Email is invalid";
    } else {
      return "true";
    }
  }
  return "Email can not be empty";
};

//Mobile number validations and checking if null
const validateMobile = (value) => {
  var regex = new RegExp(/^(?:\+94)[0-9]{9,9}$/);
  if (value) {
    if (!regex.test(value)) {
      return "Mobile Number is invalid";
    } else {
      return "true";
    }
  }
  return "Mobile Number can not be empty";
};

//Password validation and checking if null
const validatePassword = (value) => {
  const pattern = "^.{6,}$";
  const regex = new RegExp(pattern);
  if (value) {
    if (!regex.test(value)) {
      return "Password is invalid";
    } else {
      return "true";
    }
  }
  return "Password can not be empty";
};

//Name validation and checking if null
const validateName = (value) => {
  const regex = new RegExp(/^[a-zA-Z](\s?[a-zA-Z]){4,29}$/);
  if (value) {
    if (!regex.test(value)) {
      return "Name should be more than 4 characters and non-numerical";
    } else {
      return "true";
    }
  }
  return "Name can not be empty";
};

//Postal code validation and checking if null
const validatePostalCode = (value) => {
  const regex = new RegExp(/^[0-9]{5,10}$/);
  if (value) {
    if (!regex.test(value)) {
      return "Postal Code is Invalid";
    } else {
      return "true";
    }
  }
  return "Postal Code can not be empty";
};

export {
  validateEmail,
  validatePassword,
  validateName,
  validatePostalCode,
  validateMobile,
};

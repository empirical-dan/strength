import {} from 'vue';

// Custom lightweight composable password validator using RegEx
// Initially used vuelidate but there were doubts about whether it would be maintained (march 2024)
// Quasar has good built-in validation system for inputs and forms
// - just have to build your own rules and/or validators:

type EmailValidator = {
  valid: boolean;
  errors: string[];
};

export function useValidateEmail(email: string | null): EmailValidator {
  const validEmail: EmailValidator = {
    valid: false,
    errors: [],
  };
  if (email === null) {
    validEmail.valid = false;
  } else {
    validEmail.valid =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      );
  }
  if (!validEmail.valid) {
    validEmail.errors?.push('Please enter a valid email address');
  }
  if (validEmail.errors?.length == 0) {
    validEmail.errors = [''];
  }
  return validEmail;
}

type PasswordValidator = {
  valid: boolean;
  errors: string[];
  length: { valid: boolean; error: string | null };
  lowercase: { valid: boolean; error: string | null };
  uppercase: { valid: boolean; error: string | null };
  number: { valid: boolean; error: string | null };
  symbol: { valid: boolean; error: string | null };
};

export function useValidatePassword(
  password: string | null
): PasswordValidator {
  const validPassword: PasswordValidator = {
    valid: false,
    errors: [],
    length: { valid: false, error: null },
    lowercase: { valid: false, error: null },
    uppercase: { valid: false, error: null },
    number: { valid: false, error: null },
    symbol: { valid: false, error: null },
  };
  console.log('validating password');
  const minLength = 10;

  if (password === null) {
    validPassword.valid = false;
    validPassword.errors = ['Enter password'];
    return validPassword;
  }

  // Test length
  if (password.length >= minLength) {
    validPassword.length.valid = true;
  }
  validPassword.length.error = !validPassword.length.valid
    ? `Password must be at least ${minLength} characters`
    : null;
  if (validPassword.length.error) {
    validPassword.errors?.push(validPassword.length.error);
  }
  // Test lowercase
  validPassword.lowercase.valid = /^(?=.*[a-z])/.test(password);
  validPassword.lowercase.error = !validPassword.lowercase.valid
    ? 'Password must contain lowercase (a-z)'
    : null;
  if (validPassword.lowercase.error) {
    validPassword.errors?.push(validPassword.lowercase.error);
  }
  // Test uppercase
  validPassword.uppercase.valid = /^(?=.*[A-Z])/.test(password);
  validPassword.uppercase.error = !validPassword.uppercase.valid
    ? 'Password must contain uppercase (A-Z)'
    : null;
  if (validPassword.uppercase.error) {
    validPassword.errors?.push(validPassword.uppercase.error);
  }
  // Test number
  validPassword.number.valid = /^(?=.*[0-9])/.test(password);
  validPassword.number.error = !validPassword.number.valid
    ? 'Password must contain number (0-9)'
    : null;
  if (validPassword.number.error) {
    validPassword.errors?.push(validPassword.number.error);
  }
  // Test symbol
  validPassword.symbol.valid = /^(?=.*[!@#\$%\^&\*_\-=+])/.test(password);
  validPassword.symbol.error = !validPassword.symbol.valid
    ? 'Password must contain symbol'
    : null;
  if (validPassword.symbol.error) {
    validPassword.errors?.push(validPassword.symbol.error);
  }

  validPassword.valid =
    validPassword.length.valid &&
    validPassword.lowercase.valid &&
    validPassword.uppercase.valid &&
    validPassword.number.valid &&
    validPassword.symbol.valid;

  if (validPassword.errors?.length == 0) {
    validPassword.errors = [''];
  }

  return validPassword;
}

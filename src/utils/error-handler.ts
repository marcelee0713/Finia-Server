interface errorObject {
  status: string;
  message: string;
  type: string;
}

export const handleError = (err: Error): errorObject => {
  const errObj: errorObject = {
    message: "Internal server error",
    status: "500",
    type: err.message,
  };

  switch (err.message) {
    case "user-already-exist":
      errObj.message = "User already exist!";
      errObj.status = "409";
      return errObj;

    case "user-already-verified":
      errObj.message = "User already had verified its email!";
      errObj.status = "409";
      return errObj;

    case "user-already-logged-in":
      errObj.message = "User is already logged in!";
      errObj.status = "409";
      return errObj;

    case "user-does-not-exist":
      errObj.message = "User does not exist!";
      errObj.status = "404";
      return errObj;

    case "invalid-request":
      errObj.message = "Bad request, no data in the body provided!";
      errObj.status = "400";
      return errObj;

    case "invalid-username":
      errObj.message = "Username is not valid, please follow the format!";
      errObj.status = "400";
      return errObj;

    case "invalid-password":
      errObj.message = "Password is not valid, please follow the format!";
      errObj.status = "400";
      return errObj;

    case "invalid-email":
      errObj.message = "Email is not valid, please follow the format!";
      errObj.status = "400";
      return errObj;

    case "uid-mismatch":
      errObj.message =
        "UID in the request body does not match in the token's payload, please create another email verification request!";
      errObj.status = "400";
      return errObj;

    case "invalid-email-verification":
      errObj.message = "Email verification is no longer valid!";
      errObj.status = "400";
      return errObj;

    case "invalid-password-reset-request":
      errObj.message = "Password reset request is no longer valid!";
      errObj.status = "400";
      return errObj;

    case "same-password-reset-request":
      errObj.message = "New password and current password is the same!";
      errObj.status = "400";
      return errObj;

    case "wrong-credentials":
      errObj.message = "Username or password is invalid!";
      errObj.status = "401";
      return errObj;

    case "not-authorized":
      errObj.message = "Unauthorized";
      errObj.status = "401";
      return errObj;

    case "blacklisted-token":
      errObj.message = "The current request had already been used.";
      errObj.status = "403";
      return errObj;

    case "unverified-email":
      errObj.message = "Email is not verified!";
      errObj.status = "403";
      return errObj;

    case "email-service-error":
      errObj.message =
        "User created successfully, but there was an error sending the confirmation email. Please try again later or contact support for assistance.";
      errObj.status = "503";
      return errObj;

    case "email-dev-error":
      errObj.message =
        "Seems like the email you provided does not match on your email in the database. Immediately contact support for assistance.";
      errObj.status = "503";
      return errObj;

    case "email-dev-req-error":
      errObj.message =
        "Seems like the email you provided and the request's data email does not match. Immediately contact support for assistance.";
      errObj.status = "503";
      return errObj;

    default:
      return errObj;
  }
};

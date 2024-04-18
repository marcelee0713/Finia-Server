interface errorObject {
  status: number;
  message: string;
}

export const handleError = (err: Error): errorObject => {
  const errObj: errorObject = {
    message: "Internal server error",
    status: 500,
  };

  switch (err.message) {
    case "user-already-exist":
      errObj.message = "User already exist!";
      errObj.status = 409;
      return errObj;

    case "user-does-not-exist":
      errObj.message = "User does not exist!";
      errObj.status = 404;
      return errObj;

    case "wrong-credentials":
      errObj.message = "Username or password is invalid!";
      errObj.status = 401;
      return errObj;

    case "not-authorized":
      errObj.message = "Unauthorized";
      errObj.status = 401;
      return errObj;

    case "email-service-error":
      errObj.message =
        "User created successfully, but there was an error sending the confirmation email. Please try again later or contact support for assistance.";
      errObj.status = 503;
      return errObj;

    case "invalid-email-verification":
      errObj.message = "Email verification is no longer valid!";
      errObj.status = 400;
      return errObj;

    case "unverified-email":
      errObj.message = "Email is not verified!";
      errObj.status = 403;
      return errObj;

    default:
      return errObj;
  }
};

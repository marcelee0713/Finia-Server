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

    default:
      return errObj;
  }
};

interface errorObject {
  status: number;
  message: string;
}

export const handleError = (err: Error): errorObject => {
  const errObj: errorObject = {
    message: "Internal server error",
    status: 500,
  };

  if (err.message === "user-already-exist") {
    errObj.message = "User already exist!";
    errObj.status = 409;
    return errObj;
  }

  return errObj;
};

export const generateSetId = (): string => {
  const randomChar = (): string => {
    const characters = process.env.SET_ID_CHARACTERS as string;
    return characters.charAt(Math.floor(Math.random() * characters.length));
  };

  let uniqueId = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      uniqueId += randomChar();
    }
    if (i < 3) {
      uniqueId += "-";
    }
  }
  return uniqueId;
};

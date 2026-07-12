const { databasePlaceholder } = require("../dbMock");

function encodeBase62(str) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  // 1. Generate a 32-bit hash integer from the string code points
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to a 32-bit integer
  }

  // 2. Convert the signed integer to an unsigned BigInt to keep it positive
  let num = BigInt(hash >>> 0);

  if (num === 0n) return chars[0];

  let result = "";
  while (num > 0n) {
    result = chars[Number(num % 62n)] + result;
    num /= 62n;
  }

  // Strictly enforces a max length of 6 characters
  return result.slice(0, 6);
}

exports.handleEncode = (req, res) => {
  const rawlink = req.body.value;

  const encoded = encodeBase62(rawlink);
  console.log(`${encoded}`);

  const record = {
    base62: encoded,
    original: rawlink,
    shortenedUrl: `http://localhost:3000/${encoded}`,
  };

  databasePlaceholder.push(record);

  res.json(record);
};

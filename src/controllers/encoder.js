import { pool } from "../db.js";

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

const handleEncode = async (req, res) => {
  const rawlink = req.body.value;
  const session = res.locals.session;

  const userId = session?.user?.id;
  console.log(rawlink.rawlink);

  const encoded = encodeBase62(rawlink.rawlink);

  const record = {
    base62: rawlink.custom ? rawlink.custom : encoded,
    original: rawlink.rawlink,
    shortenedUrl: `http://localhost:3000/${rawlink.custom ? rawlink.custom : encoded}`,
  };
  try {
    const result = await pool.query(
      "INSERT INTO public.links (user_id, base62, original, shortened) VALUES ($1, $2, $3, $4) RETURNING *",

      [userId, record.base62, record.original, record.shortenedUrl],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to save snippet" });
  }

  res.json(record);
};

export default handleEncode;

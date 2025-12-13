const axios = require("axios");
const MOCK_DICODING_API_BASE_URL = process.env.MOCK_DICODING_API_BASE_URL;

const getUserPreferences = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ status: "error", message: "User ID dibutuhkan" });

  try {
    const resAPI = await axios.get(`${MOCK_DICODING_API_BASE_URL}/users/${userId}/preferences`);
    const preference = resAPI.data?.data?.preference || {};
    res.json({ status: "success", data: preference });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Gagal memfetch preferensi" });
  }
};

module.exports = { getUserPreferences };

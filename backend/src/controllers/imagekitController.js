const crypto = require('crypto');

// ImageKit authentication endpoint
const getImageKitAuth = async (req, res) => {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return res.status(500).json({
        error: 'ImageKit credentials are not configured',
      });
    }

    const token = crypto.randomBytes(10).toString('hex');
    const expire = Math.floor(Date.now() / 1000) + 30 * 60; // 30 minutes
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    res.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    res.status(500).json({
      error: 'Failed to generate ImageKit authentication',
    });
  }
};

module.exports = {
  getImageKitAuth,
};

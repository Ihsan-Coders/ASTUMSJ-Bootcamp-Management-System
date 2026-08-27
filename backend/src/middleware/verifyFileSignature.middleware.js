// AWEL — resource/submission upload security.
//
// upload.middleware.js's fileFilter only checks file.mimetype, which is
// the Content-Type the CLIENT declared when building the multipart
// request — fully attacker-controlled, not verified against the actual
// file content. A malicious .exe renamed with a spoofed
// Content-Type: application/pdf sails straight through it. Same problem
// for file.originalname's extension, which is just as easily spoofed.
//
// This checks the first few bytes of the actual uploaded content (the
// file's "magic number") against what its declared mimetype should
// produce, and rejects anything that doesn't match.
//
// Used by both resource.routes.js and submission.routes.js, since both
// go through upload.middleware.js and both accept the same file types.
const SIGNATURES = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  
  'application/zip': [[0x50, 0x4b, 0x03, 0x04], [0x50, 0x4b, 0x05, 0x06], [0x50, 0x4b, 0x07, 0x08]],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    [0x50, 0x4b, 0x03, 0x04], [0x50, 0x4b, 0x05, 0x06], [0x50, 0x4b, 0x07, 0x08],
  ],
  'application/msword': [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]], // legacy OLE format

};

const matchesSignature = (buffer, mimetype) => {
  const candidates = SIGNATURES[mimetype];
  if (!candidates) return true; 

  return candidates.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte)
  );
};

const verifyFileSignature = (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : []);

  for (const file of files) {
    if (!matchesSignature(file.buffer, file.mimetype)) {
      return res.status(415).json({
        success: false,
        data: null,
        message: `File content does not match its declared type: ${file.originalname}`,
      });
    }
  }

  next();
};

module.exports = verifyFileSignature;

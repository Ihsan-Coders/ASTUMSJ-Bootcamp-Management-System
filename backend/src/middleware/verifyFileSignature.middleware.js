// AWEL — resource/submission upload security (restored; had regressed
// off this branch — re-adding here so it isn't lost again).
//
// upload.middleware.js's fileFilter only checks file.mimetype, which is
// the Content-Type the CLIENT declared when building the multipart
// request — fully attacker-controlled, not verified against the actual
// file content. A malicious .exe renamed with a spoofed
// Content-Type: application/pdf sails straight through it.
//
// This checks the first few bytes of the actual uploaded content (the
// file's "magic number") against what its declared mimetype should
// produce, and rejects anything that doesn't match.
const SIGNATURES = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  // .docx is itself a ZIP container (Office Open XML), so it shares ZIP's
  // signature — can't be distinguished by magic bytes alone without
  // unpacking it, which is more than this check needs to do.
  'application/zip': [[0x50, 0x4b, 0x03, 0x04], [0x50, 0x4b, 0x05, 0x06], [0x50, 0x4b, 0x07, 0x08]],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    [0x50, 0x4b, 0x03, 0x04], [0x50, 0x4b, 0x05, 0x06], [0x50, 0x4b, 0x07, 0x08],
  ],
  'application/msword': [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]], // legacy OLE format
  // text/plain has no magic number — any byte sequence is technically
  // valid "text". Documented limitation, not an oversight.
};

const matchesSignature = (buffer, mimetype) => {
  const candidates = SIGNATURES[mimetype];
  if (!candidates) return true;
  return candidates.some((sig) => sig.every((byte, i) => buffer[i] === byte));
};

const verifyFileSignature = (req, res, next) => {
  const files = req.files
    ? Array.isArray(req.files) ? req.files : Object.values(req.files).flat()
    : req.file ? [req.file] : [];

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

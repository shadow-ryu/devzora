import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import sharp from "sharp";

interface QROptions
  extends Omit<QRCodeToDataURLOptions, "errorCorrectionLevel"> {
  logo?: Buffer;
}

export const generateQR = async ({
  data,
  options = {},
}: {
  data: string;
  options?: QROptions;
}) => {
  const defaultOptions: QRCodeToDataURLOptions = {
    errorCorrectionLevel: "H",
    margin: 4,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    width: 300,
  };
  const mergedOptions = { ...defaultOptions, ...options };
  return await QRCode.toDataURL(data, mergedOptions);
};

export const generateCustomQR = async ({
  data,
  options = {},
}: {
  data: string;
  options?: QROptions;
}) => {
  const { logo, ...qrOptions } = options;

  // Generate QR Code with High Error Correction
  const qrBuffer = await QRCode.toBuffer(data, {
    ...qrOptions,
    errorCorrectionLevel: "H", // High error correction
    type: "png",
  });

  if (!logo) {
    return `data:image/png;base64,${qrBuffer.toString("base64")}`;
  }

  // Load QR Code
  const qrImage = sharp(qrBuffer);
  const metadata = await qrImage.metadata();

  // Fetch and Process Logo
  // @ts-expect-error init
  const response = await fetch(logo);
  if (!response.ok) {
    return `data:image/png;base64,${qrBuffer.toString("base64")}`;
  }
  const imageBuffer = await response.arrayBuffer();

  const logoBuffer = await sharp(Buffer.from(imageBuffer))
    .resize({
      width: Math.round((metadata?.width || 1) * 0.18), // Reduce logo size to ~18% of QR width
      fit: "inside",
    })
    .ensureAlpha() // Ensure logo has transparency
    .toBuffer();

  const logoMetadata = await sharp(logoBuffer).metadata();

  // Composite the logo onto the QR code
  const result = await sharp(qrBuffer)
    .composite([
      {
        input: logoBuffer,
        top: Math.floor(
          ((metadata.height || 1) - (logoMetadata.height ?? 0)) / 2
        ),
        left: Math.floor(
          ((metadata.width || 1) - (logoMetadata.width ?? 0)) / 2
        ),
      },
    ])
    .toBuffer();

  return `data:image/png;base64,${result.toString("base64")}`;
};

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { data, options, type } = req.body;
//     try {
//       let qrCode;
//       if (type === 'custom') {
//         qrCode = await generateCustomQR({ data, options });
//       } else {
//         qrCode = await generateQR({ data, options });
//       }
//       res.status(200).json({ qrCode });
//     } catch (error: unknown) {
//       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
//       res.status(500).json({ error: errorMessage });
//     }
//   } else {
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }

// import prisma from '@/lib/db';
// import { currentUser } from '@clerk/nextjs/server';
import { generateQR, generateCustomQR } from "@/lib/services/qr-generator";
import { NextRequest, NextResponse } from "next/server";

// import shortid from 'shortid';

export async function POST(req: NextRequest) {
  try {
    // const user = await currentUser();
    // if (!user) {
    //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { data, customization } = body;
    const { url , text ,email} = data;

    const qrData = url|| text ||email 
    // const shortId = shortid.generate();
    console.log(data, "data",customization);
    const qrOptions = {
      color: {
        dark: customization?.foregroundColor || "#000000",
        light: customization?.backgroundColor || "#FFFFFF",
      },
    };

    let qrImage;
    if (customization?.logoUrl) {
      qrImage = await generateCustomQR({
        data: qrData,
        options: {
          ...qrOptions,
          logo: customization.logoUrl,
          //   shape: customization.shape,
          //   dotStyle: customization.dotStyle,
        },
      });
    } else {
      qrImage = await generateQR({
        data: qrData,
        options: qrOptions,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: { qrImage },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error generating QR code" },
      { status: 500 }
    );
  }
}

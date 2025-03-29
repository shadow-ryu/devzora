"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Download, Image as ImageIcon } from "lucide-react";

import { Button } from "../ui/button";
interface QrPreviewProps {
  qrImage: string | null;
  loading: boolean;
  formData: object;
  onDownload: () => void;
}

const QrPreview: React.FC<QrPreviewProps> = ({
  qrImage,
  loading,

  onDownload,
}) => {
  return (
    <Card className="shadow-lg border-none h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">QR Code Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center w-full">
          {qrImage ? (
            <div className="relative group transition-all max-w-xs mx-auto">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <Image
                  width={40}
                  height={40}
                  src={qrImage}
                  alt="Generated QR Code"
                  className="max-w-full h-auto"
                />
              </div>
              <div className="mt-2 text-center text-sm text-gray-500">
                {" QR Code"}
              </div>
            </div>
          ) : (
            <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg w-64 h-64 flex flex-col items-center justify-center">
              <span aria-label="QR code placeholder">
                <ImageIcon className="h-16 w-16 text-gray-400 mb-2" />
              </span>
              <p className="text-gray-500 text-sm">
                {loading
                  ? "Generating your QR code..."
                  : "Your QR code preview will appear here"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      {qrImage && (
        <CardFooter className="flex justify-center border-t pt-4">
          <Button
            onClick={onDownload}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default QrPreview;

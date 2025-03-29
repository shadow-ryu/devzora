/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import axios from "axios";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";
import QrPreview from "./qr-preview";
import { QrColorPicker, QrFormField } from "./qr-form-fields";

// main component
interface QrFormData {
  name: string;
  type: string;
  data: {
    url?: string;
    text?: string;
    vcard?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
    };
    wifi?: {
      ssid?: string;
      password?: string;
      encryption?: string;
    };
    email?: string;
    phone?: string;
    sms?: {
      number?: string;
      message?: string;
    };
  };
  customization: {
    foregroundColor: string;
    backgroundColor: string;
    dotStyle: string;
    shape: string;
    logoUrl: string;
  };
}

const initialFormData: QrFormData = {
  name: "",
  type: "url",
  data: { url: "" },
  customization: {
    foregroundColor: "#000000", // black color
    backgroundColor: "#FFFFFF",
    dotStyle: "rounded",
    shape: "square",
    logoUrl: "",
  },
};

const QrGenerator: React.FC = () => {
  const [formData, setFormData] = useState<QrFormData>(initialFormData);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("content");
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: QrFormData) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prev,
          [parent]: {
            // @ts-ignore
            ...(prev[parent] ?? {}), // Ensure parent exists
            [child]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prev,
          [parent]: {
            // @ts-ignore
            ...(prev[parent as keyof QrFormData] ?? {}),
            [child]: value,
          },
        };
      }

      // Reset `data` when type changes
      if (name === "type") {
        const newData: QrFormData["data"] = {};
        switch (value) {
          case "url":
            newData.url = "";
            break;
          case "text":
            newData.text = "";
            break;
          case "wifi":
            newData.wifi = { ssid: "", password: "", encryption: "WPA" };
            break;
          case "email":
            newData.email = "";
            break;
          case "phone":
            newData.phone = "";
            break;
          case "sms":
            newData.sms = { number: "", message: "" };
            break;
        }
        return { ...prev, [name]: value, data: newData };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleColorChange = (color: string, name: string) => {
    setFormData((prev) => {
      const [parent, child] = name.split(".");
      return {
        ...prev,
        [parent]: {
            // @ts-ignore
          ...(prev[parent as keyof QrFormData] ?? {}),
          [child]: color,
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(formData, "formData");
      const response = await axios.post("/api/qr/create", formData);
      setQrImage(response.data.data.qrImage);
    } catch (error) {
      console.error("Error creating QR code:", error);
      toast.error("Error creating QR code:",);
    } finally {
      setLoading(false);
    }
    // toast({
    //   title: "QR Code Generated",
    //   description: "Your QR code has been successfully created.",
    // });

    toast.success("🎉 QR Code Generated", {
      description: `Your QR code has been successfully created.`,
    });
  };

  const downloadQrCode = () => {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `${formData.name || "qr-code"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


    toast.success("🎉  Code Generated Downloaded", {
      description: `QR code has been downloaded successfully.`,
    });
  };

  const renderContentFields = () => {
    switch (formData.type) {
      case "url":
        return (
          <QrFormField
            label="Website URL"
            name="data.url"
            type="url"
            value={formData.data.url || ""}
            onChange={handleInputChange}
            placeholder="https://example.com"
            required
          />
        );
      case "text":
        return (
          <QrFormField
            label="Text Content"
            name="data.text"
            type="text"
            value={formData.data.text || ""}
            onChange={handleInputChange}
            placeholder="Enter your text here"
            required
          />
        );

      case "wifi":
        return (
          <>
            <QrFormField
              label="Network Name (SSID)"
              name="data.wifi.ssid"
              type="text"
              value={formData.data.wifi?.ssid || ""}
              onChange={handleInputChange}
              placeholder="WiFi Network Name"
              required
            />
            <QrFormField
              label="Password"
              name="data.wifi.password"
              type="text"
              value={formData.data.wifi?.password || ""}
              onChange={handleInputChange}
              placeholder="WiFi Password"
            />
            <div className="space-y-2">
              <Label htmlFor="wifi-encryption">Encryption</Label>
              <Select
                value={formData.data.wifi?.encryption || "WPA"}
                onValueChange={(value) =>
                  handleSelectChange(value, "data.wifi.encryption")
                }
              >
                <SelectTrigger id="wifi-encryption">
                  <SelectValue placeholder="Select encryption type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case "email":
        return (
          <QrFormField
            label="Email Address"
            name="data.email"
            type="email"
            value={formData.data.email || ""}
            onChange={handleInputChange}
            placeholder="contact@example.com"
            required
          />
        );
      case "phone":
        return (
          <QrFormField
            label="Phone Number"
            name="data.phone"
            type="tel"
            value={formData.data.phone || ""}
            onChange={handleInputChange}
            placeholder="+1 123 456 7890"
            required
          />
        );
      case "sms":
        return (
          <>
            <QrFormField
              label="Phone Number"
              name="data.sms.number"
              type="tel"
              value={formData.data.sms?.number || ""}
              onChange={handleInputChange}
              placeholder="+1 123 456 7890"
              required
            />
            <QrFormField
              label="Message"
              name="data.sms.message"
              type="text"
              value={formData.data.sms?.message || ""}
              onChange={handleInputChange}
              placeholder="Your SMS message"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Card className="shadow-lg border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">
                Create Your QR Code
              </CardTitle>
              <CardDescription>
                Customize your QR code for websites, contact info, WiFi networks
                and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <QrFormField
                  label="QR Code Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="My QR Code"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="qr-type">QR Code Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange(value, "type")}
                  >
                    <SelectTrigger id="qr-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">Website URL</SelectItem>
                      <SelectItem value="text">Plain Text</SelectItem>
                      {/* <SelectItem value="vcard">
                        Contact Card (vCard)
                      </SelectItem> */}
                      {/* <SelectItem value="wifi">WiFi Network</SelectItem> */}
                      <SelectItem value="email">Email Address</SelectItem>
                      {/* <SelectItem value="phone">Phone Number</SelectItem>
                      <SelectItem value="sms">SMS Message</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 pt-4">
                    {renderContentFields()}
                  </TabsContent>

                  <TabsContent value="design" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <QrColorPicker
                        label="Foreground Color"
                        name="customization.foregroundColor"
                        value={formData.customization.foregroundColor}
                        onChange={handleColorChange}
                      />

                      <QrColorPicker
                        label="Background Color"
                        name="customization.backgroundColor"
                        value={formData.customization.backgroundColor}
                        onChange={handleColorChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dot-style">Dot Style</Label>
                      <Select
                        value={formData.customization.dotStyle}
                        onValueChange={(value) =>
                          handleSelectChange(value, "customization.dotStyle")
                        }
                      >
                        <SelectTrigger id="dot-style">
                          <SelectValue placeholder="Select dot style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="dots">Dots</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shape">QR Shape</Label>
                      <Select
                        value={formData.customization.shape}
                        onValueChange={(value) =>
                          handleSelectChange(value, "customization.shape")
                        }
                      >
                        <SelectTrigger id="shape">
                          <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <QrFormField
                      label="Logo URL (optional)"
                      name="customization.logoUrl"
                      type="url"
                      value={formData.customization.logoUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </TabsContent>
                </Tabs>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate QR Code"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <QrPreview
            qrImage={qrImage}
            loading={loading}
            formData={formData}
            onDownload={downloadQrCode}
          />
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;

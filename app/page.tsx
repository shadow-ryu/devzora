import QrGenerator from "@/components/qr/qr-creator";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Dynamic QR Designer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create beautiful, customized QR codes for your websites, contact
            information, WiFi networks and more.
          </p>
        </div>

        <QrGenerator />
      </div>
    </div>
  );
}

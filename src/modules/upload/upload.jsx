import ImageUpload from "../../components/ImageUpload";

export default function UploadPage() {
  return (
    <div className="max-w-xl mx-auto w-full px-4 py-16 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Upload to your portfolio</h1>
      <ImageUpload/>
    </div>
  );
}

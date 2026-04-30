import ImageUpload from "../../components/ImageUpload";
import Navbar from "../../components/Navbar";

export default function UploadPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto w-full px-4 py-24 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add to your portfolio</h1>
        <ImageUpload />
      </div>
    </>
  );
}

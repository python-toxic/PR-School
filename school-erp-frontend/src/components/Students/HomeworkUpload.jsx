import { useState } from "react";
import { Button } from "../ui/button.jsx";

export default function HomeworkUpload({ onSubmit }) {
  const [file, setFile] = useState(null);

  function handleSubmit() {
    if (!file) return alert("Please upload a file");
    onSubmit(file);
  }

  return (
    <div className="mt-4 space-y-2">
      <input
        type="file"
        className="input"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <Button onClick={handleSubmit} className="w-full">
        Submit Homework
      </Button>
    </div>
  );
}

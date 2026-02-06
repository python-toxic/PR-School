import { useState } from "react";

export default function AddHomeworkForm({ onAdd }) {
  const [form, setForm] = useState({
    className: "",
    subject: "",
    title: "",
    description: "",
    dueDate: "",
    attachments: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file), 
    }));

    setForm((prev) => ({
      ...prev,
      attachments: files,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);

    
    setForm({
      className: "",
      subject: "",
      title: "",
      description: "",
      dueDate: "",
      attachments: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-5 space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <input
          name="className"
          placeholder="Class (e.g. 10-A)"
          value={form.className}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <input
        name="title"
        placeholder="Homework Title"
        value={form.title}
        onChange={handleChange}
        className="input w-full"
        required
      />

      <textarea
        name="description"
        placeholder="Homework Description"
        value={form.description}
        onChange={handleChange}
        className="input w-full h-24"
        required
      />

      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        className="input"
        required
      />

      
      <div>
        <label className="block text-sm font-medium mb-1">
          Attach Files (PDF, DOC, Images)
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,image/*"
          onChange={handleFileChange}
          className="input"
        />
      </div>

      
      {form.attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Files:</p>
          <ul className="text-sm space-y-1">
            {form.attachments.map((file, index) => (
              <li key={index} className="flex items-center gap-2">
                {file.type.startsWith("image") ? "🖼️" : "📄"}
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Assign Homework
      </button>
    </form>
  );
}

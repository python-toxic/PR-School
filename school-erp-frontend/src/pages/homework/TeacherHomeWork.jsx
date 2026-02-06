import { useState } from "react";
import AddHomeworkForm from "../../components/Teacher/HomeworkForm.jsx";
import HomeworkList from "../../components/Teacher/HomeworkList.jsx";
import CurrentHomeworkList from "../../components/Teacher/CurrentHomeworkList.jsx";

export default function TeacherHomework() {
  const [homeworks, setHomeworks] = useState([]);

  const addHomework = (homework) => {
    setHomeworks((prev) => [
      { id: Date.now(), ...homework },
      ...prev,
    ]);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Homework Management</h1>

      <AddHomeworkForm onAdd={addHomework} />
      <HomeworkList homeworks={homeworks} />

      {/* Current Homework blue cards */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Current Homework — Check by Student</h2>
        <CurrentHomeworkList />
      </div>
    </div>
  );
}

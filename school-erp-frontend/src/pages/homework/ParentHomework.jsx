import HomeworkCard from "../../components/Students/HomeworkCard.jsx";
import { fakeHomework } from "../../data/Student/homework.data.js";


const role = "parent"; 

export default function ParentHomework() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Homework</h1>

      <div className="grid gap-4">
        {fakeHomework.map((hw) => (
          <HomeworkCard key={hw.id} homework={hw} role={role} />
        ))}
      </div>
    </div>
  );
}

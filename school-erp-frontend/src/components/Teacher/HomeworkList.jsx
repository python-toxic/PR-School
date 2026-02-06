import HomeworkCard from "./HomeworkCard";

export default function HomeworkList({ homeworks }) {
  if (homeworks.length === 0) {
    return (
      <p className="text-gray-500">
        No homework assigned yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {homeworks.map((hw) => (
        <HomeworkCard key={hw.id} homework={hw} />
      ))}
    </div>
  );
}

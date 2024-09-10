import React from "react";

const students = [
  { id: 1, name: "Ron" },
  { id: 2, name: "Steve" },
  { id: 3, name: "Jane" },
  { id: 4, name: "Jeff" },
];

function AttendanceBook(props) {
  return (
    <ul>
      {students.map((student) => {
        return <li key={student.id}>{student.name}</li>;
      })}
    </ul>
  );
}

export default AttendanceBook;

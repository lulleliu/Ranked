import { Link, useParams } from "react-router-dom";

import CourseRating from "../components/CourseRating";

export function CoursePage() {
  const { courseCode } = useParams();
  const CourseUrl =
    "https://www.kth.se/student/kurser/kurs/" + decodeURIComponent(courseCode);

  return (
    <div style={{ padding: "2rem" }}>
      <p>
        <Link onClick={() => window.open("/", "_blank")}> Back </Link>
      </p>
      <h1>{decodeURIComponent(courseCode)}</h1>
      <p>
        Kurssida:{" "}
        <Link onClick={() => window.open(CourseUrl, "_blank")}>
          https://www.kth.se/student/kurser/kurs/
          {decodeURIComponent(courseCode)}
        </Link>
      </p>

      <h3>Rating</h3>
      <CourseRating />
    </div>
  );
}

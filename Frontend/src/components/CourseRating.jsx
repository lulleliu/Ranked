import { Rating } from "@mantine/core";

function CourseRating() {
  return (
    <div>
      Rating
      <Rating fractions={4} defaultValue={0} />
    </div>
  );
}

export default CourseRating;

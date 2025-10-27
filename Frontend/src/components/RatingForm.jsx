import { Rating, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

function RatingForm({ onRating, userRating }) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      rating: userRating || 0,
    },
  });

  // Update form value whenever userRating changes
  useEffect(() => {
    form.setFieldValue("rating", userRating || 0);
  }, [userRating]);

  const handleSubmit = async (values) => {
    if (onRating) {
      onRating(values);
    }
  };

  console.log("user rating from form: ", userRating);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      Rating
      <Rating
        fractions={2}
        value={form.values.rating} // controlled value
        key={form.key("rating")}
        {...form.getInputProps("rating")}
        onChange={(value) => {
          form.setFieldValue("rating", value);
        }}
      />
      <Button type="submit">Rate</Button>
    </form>
  );
}

export default RatingForm;

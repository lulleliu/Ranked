import { Rating, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

function RatingForm({ onRating }) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      rating: 0,
    },
  });

  const handleSubmit = async (values) => {
    if (onRating) {
      onRating(values);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      Rating
      <Rating
        fractions={2}
        defaultValue={0}
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

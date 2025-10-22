import { useForm } from "@mantine/form";
import { Textarea, Group, Button } from "@mantine/core";

function CommentForm({ onComment }) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      comment: "",
    },
  });

  const handleSubmit = async (values) => {
    if (onComment) {
      onComment(values);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Textarea
        placeholder="Add a comment..."
        autosize
        minRows={2}
        key={form.key("username")}
        {...form.getInputProps("comment")}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Comment</Button>
      </Group>
    </form>
  );
}

export default CommentForm;

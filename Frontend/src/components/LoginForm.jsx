import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

function LoginForm({ onLogin }) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = (values) => {
    if (onLogin) {
      onLogin(values);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Username"
        description="Your KTH-account username"
        placeholder="roy"
        key={form.key("username")}
        {...form.getInputProps("username")}
      />

      <PasswordInput
        label="Password"
        description="Your KTH-account password"
        placeholder="pannkaka123"
        key={form.key("password")}
        {...form.getInputProps("password")}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export default LoginForm;

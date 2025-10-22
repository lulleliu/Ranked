import { Avatar, Group, Text, Paper, Space } from "@mantine/core";
import student_icon from "../assets/student_icon.png"; // adjust the path relative to the file

export function CommentSimple({ time, comment }) {
  return (
    <div>
      <Paper withBorder radius="md">
        <Space h="md" />
        <Group>
          <Avatar src={student_icon} alt="KTH Student" radius="xl" />
          <div>
            <Text size="sm">KTH Student</Text>
            <Text size="xs" c="dimmed">
              {time}
            </Text>
          </div>
        </Group>
        <Text pl={54} pt="sm" size="sm">
          {comment}
        </Text>
        <Space h="md" />
      </Paper>
      <Space h="md" />
    </div>
  );
}

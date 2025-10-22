import { useState, useEffect } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import {
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  Rating,
} from "@mantine/core";
import classes from "./TableSort.module.css";

import { useNavigate } from "react-router-dom";

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  if (!data || data.length === 0) return [];
  return data.filter((item) =>
    keys(data[0]).some(
      (key) => item[key] && item[key].toString().toLowerCase().includes(query)
    )
  );
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aVal = a[sortBy] ? a[sortBy].toString() : "";
      const bVal = b[sortBy] ? b[sortBy].toString() : "";

      if (payload.reversed) {
        return bVal.localeCompare(aVal);
      }

      return aVal.localeCompare(bVal);
    }),
    payload.search
  );
}

export function TableSort({ data = [], username }) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  // Update when data changes from parent
  useEffect(() => {
    setSortedData(data);
  }, [JSON.stringify(data)]);

  const navigate = useNavigate();

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const handleCourseCodeClick = (course) => {
    navigate(`/courses/${encodeURIComponent(course.code)}`, {
      state: { username: username },
    });
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.code}>
      <Table.Td
        onClick={() => handleCourseCodeClick(row)}
        style={{ cursor: "pointer" }}
      >
        {row.code}
      </Table.Td>
      <Table.Td
        onClick={() => handleCourseCodeClick(row)}
        style={{ cursor: "pointer" }}
      >
        {row.name}
      </Table.Td>
      <Table.Td>{row.company}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        layout="fixed"
      >
        <Table.Thead>
          <Table.Tr>
            <Th
              sorted={sortBy === "code"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("code")}
            >
              Course Code
            </Th>
            <Th
              sorted={sortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("name")}
            >
              Title
            </Th>
            <Th
              sorted={sortBy === "company"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("company")}
            >
              Rating
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td
                colSpan={data.length > 0 ? Object.keys(data[0]).length : 3}
              >
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

import { useEffect, useState } from "react";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Button, Stack, Title, PasswordInput, TextInput } from "@mantine/core";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

import { NavbarMinimal } from "../components/NavbarMinimal/NavbarMinimal.jsx";
import { HeaderSimple } from "../components/HeaderSimple/HeaderSimple.jsx";
import { TableSort } from "../components/TableSort/TableSort.jsx";
import LoginForm from "../components/LoginForm.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [opened, { toggle }] = useDisclosure();
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (values) => {
    try {
      const response = await fetch("/api/get_courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      setCourses(data);
      console.log(courses);

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 80, breakpoint: "sm" }}
      padding="md"
    >
      {/* 
      <AppShell.Header>
        <HeaderSimple />
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarMinimal />
      </AppShell.Navbar>
      */}

      <AppShell.Main>
        <LoginForm onLogin={handleLogin} />

        <TableSort data={courses} />
      </AppShell.Main>
    </AppShell>
  );
}

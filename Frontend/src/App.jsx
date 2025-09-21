import { useEffect, useState } from "react";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Button, Stack, Title } from "@mantine/core";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { NavbarMinimal } from "./components/NavbarMinimal/NavbarMinimal.jsx";
import { HeaderSimple } from "./components/HeaderSimple/HeaderSimple.jsx";

export default function App() {
  const [message, setMessage] = useState("");
  const [opened, { toggle }] = useDisclosure();

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Error fetching API:", err));
  }, []);

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 80, breakpoint: "sm" }}
      padding="md"
    >
      <AppShell.Header>
        <HeaderSimple />
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarMinimal />
      </AppShell.Navbar>

      <AppShell.Main>
        <h1>Main Content</h1>
        {message && <p>API Message: {message}</p>}
      </AppShell.Main>
    </AppShell>
  );
}

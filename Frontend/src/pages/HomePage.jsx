import { useEffect, useState } from "react";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import {
  Button,
  Stack,
  Title,
  PasswordInput,
  TextInput,
  Tabs,
} from "@mantine/core";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

// Components
import { NavbarMinimal } from "../components/NavbarMinimal/NavbarMinimal.jsx";
import { HeaderSimple } from "../components/HeaderSimple/HeaderSimple.jsx";
import { TableSort } from "../components/TableSort/TableSort.jsx";
import LoginForm from "../components/LoginForm.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Supabase
//import { createClient } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient.jsx";

//const supabase = createClient(
// "https://bobiwkiblvbejagvambv.supabase.co",
// "sb_publishable_z6v5yfjllgutDFbRNha8Og_QjSiLCL4"
//);

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [opened, { toggle }] = useDisclosure();
  const [userCourses, setUserCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dbCourses, setDbCourses] = useState([]);
  const [missingCourses, setMissingCourses] = useState([]);

  const [tableView, setTableView] = useState("personal");
  const [userName, setUserName] = useState("");

  const getDbCourses = async () => {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) console.error("Error inserting new courses:", error);
    else setDbCourses(data);
  };

  useEffect(() => {
    getDbCourses();
  }, []);

  const handleLogin = async (values) => {
    try {
      const response = await fetch("/api/get_courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      setUserCourses(data);
      setIsLoggedIn(true);
      setUserName(values.username);

      const missingCourses = data.filter(
        (userCourse) =>
          !dbCourses.some((dbCourse) => dbCourse.code === userCourse.code)
      );

      setMissingCourses(missingCourses);
      console.log(missingCourses);

      const mappedCourses = missingCourses.map((course) => ({
        code: course.code, // rename field to match DB
        name: course.name,
        credits: parseFloat(course.points) || null, // optional, set default if missing
      }));

      if (missingCourses.length > 0) {
        const { data, error } = await supabase
          .from("courses")
          .insert(mappedCourses);

        if (error) console.error("Error inserting new courses:", error);
        else {
          console.log("Added new courses:", data);
          getDbCourses();
        }
      } else {
        console.log("No new courses to add — everything is up to date!");
      }
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
        <Tabs defaultValue="userCourses">
          <Tabs.List>
            <Tabs.Tab value="userCourses">My Courses</Tabs.Tab>
            <Tabs.Tab value="allCourses">All Courses</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="userCourses">
            {isLoggedIn === true && (
              <TableSort data={userCourses} username={userName} />
            )}
            {isLoggedIn === false && <p>Please log in to see your courses</p>}
          </Tabs.Panel>

          <Tabs.Panel value="allCourses">
            <TableSort data={dbCourses} username={userName} />
          </Tabs.Panel>
        </Tabs>
      </AppShell.Main>
    </AppShell>
  );
}

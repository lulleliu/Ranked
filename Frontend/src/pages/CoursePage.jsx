import { Link, useParams, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";

import RatingForm from "../components/RatingForm";

import { Textarea, Paper, Space, Rating } from "@mantine/core";

import { supabase } from "../supabaseClient";
import CommentForm from "../components/CommentForm";
import { CommentSimple } from "../components/CommentSimple";

import moment from "moment";
import tz from "moment-timezone";

export default function CoursePage() {
  const { courseCode } = useParams();
  const [course, setCourse] = useState();
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoaded, setRatingsLoaded] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // Access Username
  // const location = useLocation();
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    getCourse();
  }, []);

  useEffect(() => {
    if (course?.id) {
      getComments();
      getRatings();
      getUserRating();
    }
    console.log("Comments: ", comments);
    console.log("Ratings: ", ratings);
  }, [course]);

  const getUserRating = async () => {
    const { data: existing } = await supabase
      .from("ratings")
      .select("*")
      .eq("course_id", course.id)
      .eq("user_id", username)
      .single();

    if (existing) {
      setUserRating(existing.stars);
    }
  };

  const getCourse = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("code", decodeURIComponent(courseCode))
      .single();
    if (error) console.error("Error getting course:", error);
    setCourse(data);
  };

  const getComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("course_id", course?.id);
    if (error) console.error("Error getting comments:", error);
    setComments(data);
  };

  const getRatings = async () => {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("course_id", decodeURIComponent(course?.id));
    if (error) console.error("Error getting ratings:", error);
    setRatings(data);
    setRatingsLoaded(true);
  };

  const handleComment = async (values) => {
    const userCourses = JSON.parse(sessionStorage.getItem("userCourses")) || [];
    const hasTakenCourse = userCourses.some((c) => c.code === course.code);

    if (!hasTakenCourse) {
      return alert("You can only comment on courses you have taken.");
    }
    if (username !== "") {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          { course_id: course.id, user_id: username, comment: values.comment },
        ])
        .select("id, course_id, user_id, comment, created_at");

      if (error) console.error("Error inserting new comment:", error);
      else {
        console.log("Added new Comment:", data);
        getComments();
      }
    } else {
      alert("Please log in first");
    }
  };

  const handleRating = async (values) => {
    if (!username) return alert("Please log in first");

    const userCourses = JSON.parse(sessionStorage.getItem("userCourses")) || [];
    console.log("userCourses: ", userCourses);
    const hasTakenCourse = userCourses.some((c) => c.code === course.code);

    if (!hasTakenCourse) {
      return alert("You can only rate courses you have taken.");
    }

    const { data: existing } = await supabase
      .from("ratings")
      .select("*")
      .eq("course_id", course.id)
      .eq("user_id", username)
      .single();

    if (existing) {
      // Update the existing rating
      const { data, error } = await supabase
        .from("ratings")
        .update({ stars: values.rating })
        .eq("id", existing.id)
        .select();

      if (error) console.error("Error updating rating:", error);
      else console.log("Updated rating:", data);

      await getRatings(); // Refresh ratings after update
    } else {
      // Insert new rating
      const { data, error } = await supabase
        .from("ratings")
        .insert([
          { course_id: course.id, user_id: username, stars: values.rating },
        ])
        .select();

      if (error) console.error("Error inserting new rating:", error);
      else console.log("Added new rating:", data);

      await getRatings(); // Refresh ratings after insert
    }
  };

  const comment_elements = comments.map((comment) => (
    <CommentSimple
      time={moment.utc(comment.created_at).tz("Europe/Stockholm").fromNow()}
      comment={comment.comment}
    />
  ));

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
      : 0;

  console.log(averageRating);

  const CourseUrl =
    "https://www.kth.se/student/kurser/kurs/" + decodeURIComponent(courseCode);

  return (
    <div style={{ padding: "2rem" }}>
      <p>
        <Link to={"/"}> Back </Link>
      </p>
      <h1>
        {decodeURIComponent(courseCode)}: {course?.name}
      </h1>
      <h3>
        {ratingsLoaded && (
          <Rating
            fractions={100}
            value={
              ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
            }
            readOnly
            size="xl"
          />
        )}
        ({ratings.length})
      </h3>
      <p>
        Kurssida:{" "}
        <Link onClick={() => window.open(CourseUrl, "_blank")}>
          https://www.kth.se/student/kurser/kurs/
          {decodeURIComponent(courseCode)}
        </Link>
      </p>

      <h3>Leave a rating</h3>
      <RatingForm onRating={handleRating} userRating={userRating} />

      <h3>Leave a comment</h3>
      <CommentForm onComment={handleComment} />
      <Space h="md" />
      {comment_elements}
    </div>
  );
}

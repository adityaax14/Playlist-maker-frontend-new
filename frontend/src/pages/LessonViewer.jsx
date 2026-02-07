import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { getLessonById } from "../api/course.js";
import { startLesson, completeLesson,updateLessonTime } from "../api/progress.js";
import "../styles/lesson.css";

export default function LessonViewer() {
  const { courseId, lessonId } = useParams();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // mark lesson as started
    startLesson(courseId, lessonId);

    const fetchLesson = async () => {
      try {
        const res = await getLessonById(courseId, lessonId);
        setLesson(res.data);
      } catch (err) {
        console.error("Failed to load lesson", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  useEffect(() => {
  let interval;

  interval = setInterval(() => {
    updateLessonTime(courseId, lessonId, 5);
  }, 5000);

  return () => clearInterval(interval);
}, [courseId, lessonId]);

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <AuthLayout>
  <div className="lesson-layout">
  {/* Left side */}
  <div className="lesson-left">
    <span className="lesson-badge">Lesson</span>

    <h1 className="lesson-title">{lesson.title}</h1>
    <p className="lesson-description">
      {lesson.description}
    </p>

    {lesson.duration && (
      <div className="lesson-time">
        ⏱ {lesson.duration} min
      </div>
    )}

    <button
      className="complete-lesson-btn"
      onClick={() => completeLesson(courseId, lessonId)}
    >
      Mark as Completed
    </button>
  </div>

  {/* Right side */}
  <div className="lesson-right">
    <div className="lesson-video-box">
      <video
        className="lesson-video"
        controls
        preload="metadata"
      >
        <source src={lesson.videoUrl} type="video/mp4" />
      </video>
    </div>
  </div>
</div>
</AuthLayout>

  );
}

import "./FeedbackButton.css";

function FeedbackButton() {

  const openFeedback = () => {
    window.open(
    //   "https://ats-resume-ai-tool.canny.io/",
    "https://docs.google.com/forms/d/e/1FAIpQLSeZRUewL_j9DDdP8gplOUKfY0igrZwxQGjVu6G2oRQ70EP16Q/viewform?usp=publish-editor",
      "_blank"
    );
  };

  return (
    <button className="feedback-button" onClick={openFeedback}>
      💡 Drop Your Feedback
    </button>
  );
}

export default FeedbackButton;
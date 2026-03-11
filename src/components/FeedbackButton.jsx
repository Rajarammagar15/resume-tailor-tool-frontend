import "./FeedbackButton.css";

function FeedbackButton() {

  const openFeedback = () => {
    window.open(
      "https://ats-resume-ai-tool.canny.io/",
      "_blank"
    );
  };

  return (
    <button className="feedback-button" onClick={openFeedback}>
      💡 Feedback
    </button>
  );
}

export default FeedbackButton;
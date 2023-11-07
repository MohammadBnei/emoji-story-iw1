import { StoryStep } from "@/interface/event";

interface Props {
  step: StoryStep;
  onVote: (payload: { emoji: string; stepOrder: number }) => void;
}

const Step = ({ step, onVote }: Props) => {
  return (
    <div className="text-2xl">
      {Object.entries(step.emojiCandidate).map(([emoji, vote]) => (
        <div key={emoji}>
          <button
            className="btn"
            onClick={() => onVote({ emoji, stepOrder: step.order })}
          >
            {emoji}
          </button>{" "}
          - {vote}
        </div>
      ))}
    </div>
  );
};

export default Step;

export default function EventActions({ onSubmit }) {
    return (
      <div className="flex gap-4">
        <button onClick={onSubmit} className="bg-blue-500 text-white p-2">
          Create Event
        </button>
      </div>
    );
  }
  
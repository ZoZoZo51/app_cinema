import { useState } from "react";
import { FaClapperboard } from "react-icons/fa6";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  handleWatchedMovie: (movie: Movie, remove?: boolean, rating?: number) => Promise<void>;
}

const ModalAddMovie = (props: Props) => {
  const [rating, setRating] = useState(0);

  if (props.showModal && props.selectedMovie) {
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">{props.selectedMovie.title}</h2>

        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaClapperboard
              key={star}
              className={`w-6 h-6 mx-1 cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              props.setShowModal(false);
              props.setSelectedMovie(null);
            }}
            className="px-4 py-2 bg-red-200 rounded hover:bg-red-300"
          >
            Annuler
          </button>

          <button
            onClick={async () => {
              if (!props.selectedMovie) return;
              await props.handleWatchedMovie(props.selectedMovie, false, rating);
              props.setShowModal(false);
              props.setSelectedMovie(null);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Valider
          </button>
        </div>
      </div>
    </div>)
  }
  return <></>;
}

export default ModalAddMovie;
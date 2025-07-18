import { Link } from "react-router-dom";

const ProblemCard = ({ problem }) => {
  const { _id, title, description, tags, companyId } = problem;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <p className="text-sm text-gray-500 font-semibold">
          {companyId?.fullName || "A Company"}
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">{title}</h2>
      </div>

      <p className="text-gray-600 mb-4">
        {description.substring(0, 150)}
        {description.length > 150 ? "..." : ""}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        to={`/problem/${_id}`}
        className="inline-block font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProblemCard;

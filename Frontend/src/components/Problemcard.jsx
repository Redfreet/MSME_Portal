import { Link } from "react-router-dom";

const ProblemCard = ({ problem, isClosed = false }) => {
  const { _id, title, description, tags, companyId } = problem;

  const cardClasses = `
    bg-white rounded-lg shadow-sm p-5 border border-gray-200 hover:shadow-lg transition-all ${
      isClosed ? "opacity-70 bg-gray-50 hover:scale-100" : "hover:scale-100"
    }`;

  return (
    <div className={cardClasses}>
      <div className="mb-4">
        <p className="text-sm text-gray-500 font-semibold">
          {companyId?.companyName
            ? `${companyId.companyName} (${companyId.fullName})`
            : companyId?.fullName || "A Company"}
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
        className="border border-gray-700 hover:border-green-600 hover:text-green-600 uppercase px-5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 text-base"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProblemCard;

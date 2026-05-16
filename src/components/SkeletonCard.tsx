import { useTheme } from "../context/ThemeContext";

const SkeletonCard = () => {
  const { t } = useTheme();

  return (
    <div
      className={`${t.cardBg} rounded-2xl overflow-hidden border ${t.border} animate-pulse`}
    >
      <div className="bg-gray-200 dark:bg-gray-700 h-52 w-full" />
      <div className="p-4">
        <div className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded mt-1" />
        <div className="bg-gray-200 dark:bg-gray-700 h-4 w-1/4 rounded mt-3" />
        <div className="bg-gray-200 dark:bg-gray-700 h-3 w-full rounded mt-3" />
        <div className="bg-gray-200 dark:bg-gray-700 h-3 w-2/3 rounded mt-2" />
        <div className="bg-gray-200 dark:bg-gray-700 h-10 rounded-xl mt-4" />
        <div className="bg-gray-200 dark:bg-gray-700 h-10 rounded-xl mt-2" />
      </div>
    </div>
  );
};

export default SkeletonCard;

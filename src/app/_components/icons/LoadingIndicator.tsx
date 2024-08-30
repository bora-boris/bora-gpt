export const LoadingIndicator = () => {
  return (
    <div className="flex space-x-2">
      <div className="flex max-w-xs space-x-2 rounded-lg bg-muted p-6 text-gray-800">
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-200"></div>
        <div className="delay-400 h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
      </div>
    </div>
  );
};

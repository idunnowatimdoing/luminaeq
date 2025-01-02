export const AssessmentLoading = () => {
  return (
    <div className="min-h-screen bg-[#051527] flex items-center justify-center">
      <div className="text-white text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-4 border-[#00ffd5] border-t-transparent rounded-full mx-auto"></div>
        <p>Loading your assessment...</p>
      </div>
    </div>
  );
};
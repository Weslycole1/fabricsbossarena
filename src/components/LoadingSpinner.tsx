const LoadingSpinner = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <div className="w-10 h-10 border-4 border-[#E8E0D5] border-t-[#C9974A] rounded-full animate-spin" />
    <p className="text-sm text-[#6B5B4E]">{label}</p>
  </div>
)

export default LoadingSpinner

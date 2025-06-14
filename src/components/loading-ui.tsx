export default function Loading({ description }: { description: string }) {
  return (
    <div className="flex items-center justify-center h-screen max-h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

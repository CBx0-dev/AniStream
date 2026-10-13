export function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/10 blur-3xl dark:from-indigo-500/25 dark:via-purple-600/20 dark:to-pink-600/10" />
      <div className="absolute top-[35%] -left-48 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15" />
      <div className="absolute top-[65%] -right-48 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-600/15" />
    </div>
  );
}

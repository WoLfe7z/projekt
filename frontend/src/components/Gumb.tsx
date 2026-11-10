export default function Gumb({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="h-11 w-full rounded-md bg-trava font-medium text-white hover:bg-trava-temna focus-visible:ring-2 focus-visible:ring-trava/40 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
    >
      {children}
    </button>
  );
}

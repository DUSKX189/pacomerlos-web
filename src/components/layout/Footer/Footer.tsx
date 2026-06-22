import NotifyForm from './NotifyForm';

export default function Footer() {
  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-6 text-sm text-black/60 md:flex-row md:items-end md:justify-between">
        <NotifyForm />
        <p>&copy; {new Date().getFullYear()} Pacomerlos</p>
      </div>
    </footer>
  );
}

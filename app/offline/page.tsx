export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-card)]">
        <h1 className="font-[var(--font-manrope)] text-2xl font-semibold text-[var(--text)]">Нет подключения</h1>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          Похоже, сейчас нет интернета. Проверь подключение и попробуй снова.
        </p>
        <p className="mt-6 inline-flex h-11 items-center justify-center rounded-[16px] bg-[var(--brand-700)] px-5 text-sm font-semibold text-white">
          Обнови страницу вручную
        </p>
      </div>
    </main>
  );
}

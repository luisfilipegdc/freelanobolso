export function AuthHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="h1">{title}</h1>
      <p className="texto-grande mt-2">{description}</p>
    </div>
  );
}

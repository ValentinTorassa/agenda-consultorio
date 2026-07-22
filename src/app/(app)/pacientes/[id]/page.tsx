import { PatientDetailClient } from "./PatientDetailClient";

export default async function PacienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PatientDetailClient id={id} />;
}

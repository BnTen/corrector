import { QuizPageClient } from "@/features/quiz/components/quiz-page-client";
import { requireUser } from "@/server/security/require-user";
import { isAdminEmail } from "@/server/security/admin";

export default async function QuizPage() {
  const user = await requireUser();
  const showAdmin = isAdminEmail(user?.email);

  return <QuizPageClient showAdmin={showAdmin} />;
}

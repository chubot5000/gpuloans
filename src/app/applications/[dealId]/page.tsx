import { getDealCallStatus, getDealDetail, getParticipants } from "data/fetchers";
import { ApplicationPage, ApplicationPageProvider } from "logic/pages";
import { Suspense } from "react";
import { Msg } from "ui/components";

interface PageProps {
  params: Promise<{ dealId: string }>;
}

export default async function Page(props: PageProps) {
  const { dealId } = await props.params;

  const cache = await getCache({ dealId });

  if (!cache) return <Msg>Deal not found</Msg>;

  return (
    <Suspense>
      <ApplicationPageProvider cache={cache}>
        <ApplicationPage />
      </ApplicationPageProvider>
    </Suspense>
  );
}

async function getCache(params: { dealId: string }) {
  const { dealId } = params;
  const [dealDetail, callStatus, participants] = await Promise.all([
    getDealDetail(Number(dealId)),
    getDealCallStatus(Number(dealId)),
    getParticipants(Number(dealId)),
  ]);

  if (!dealDetail) return null;

  return { dealDetail, callStatus, participants };
}

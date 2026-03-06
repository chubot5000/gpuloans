import { Msg, PageWrapper } from "ui/components";

export default function Loading() {
  return (
    <PageWrapper className="justify-center items-center">
      <Msg>Loading...</Msg>
    </PageWrapper>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

import { FaqItem } from "../../components";

export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-12 justify-center items-center w-full max-w-3xl h-full">
      <h2 className="text-3xl text-primary font-eiko">FAQs</h2>
      <ol className="flex flex-col p-0 w-full list-none">
        <FaqItem
          key={0}
          index={0}
          open={activeIndex === 0}
          onToggle={() => handleToggle(0)}
          title="How do I apply for financing ?"
        >
          Simply fill out the{" "}
          <Link href="/contact" className="underline underline-offset-2 text-brown-500">
            Application form
          </Link>{" "}
          on this website to receive your quote. Then, schedule a call with one of our underwriters to go over your
          application in detail and plan next steps.
        </FaqItem>

        <FaqItem
          key={1}
          index={1}
          open={activeIndex === 1}
          onToggle={() => handleToggle(1)}
          title="How does your financing differ from a traditional bank loan ?"
        >
          Unlike a traditional bank loan, GPULoans look only to the GPUs as collateral when underwriting, not the cash
          flows or balance sheet of your underlying business. Placing the assets in a bankruptcy remote SPV removes
          recourse to the parent business, leaving your balance sheet unencumbered. Additionally, by building our
          process on blockchain rails, GPULoans facilitate superior ease of execution.
        </FaqItem>

        <FaqItem
          key={2}
          index={2}
          open={activeIndex === 2}
          onToggle={() => handleToggle(2)}
          title="What documents will I need to provide ?"
        >
          You&apos;ll need company formation documents for your SPV, proof of GPU purchase through invoices or binding
          purchase orders, identification and KYC information for beneficial owners, and data center agreements showing
          where hardware will be housed (along with a summary one-pager of the data center). Additional documents may be
          requested by the underwriters as needed.
        </FaqItem>

        <FaqItem
          key={3}
          index={3}
          open={activeIndex === 3}
          onToggle={() => handleToggle(3)}
          title="Can startups or new businesses apply for financing ?"
        >
          Absolutely! The beauty of the asset-backed nature of the product and the bankruptcy remote structure is that
          GPULoans are relatively agnostic to the parent company, instead focusing on asset value and operational
          metrics rather than balance sheet strength.
        </FaqItem>

        <FaqItem
          key={4}
          index={4}
          open={activeIndex === 4}
          onToggle={() => handleToggle(4)}
          title="How long does the approval process take ?"
        >
          Applications are processed in 7-30 days, significantly faster than traditional bank loans which often require
          30-90 days for approval and funding. The exact timeline depends on factors like the status of the GPUs (i.e.,
          ordered, shipping, installed and operating), the number of GPU units being financed, and how quickly you can
          provide required documentation and insurance.
        </FaqItem>

        <FaqItem
          key={5}
          index={5}
          open={activeIndex === 5}
          onToggle={() => handleToggle(5)}
          title="Will applying affect my credit score ?"
        >
          Given the asset-backed nature of the financing, there is no need to look into the credit profile of you or
          your business.
        </FaqItem>

        <FaqItem
          key={6}
          index={6}
          open={activeIndex === 6}
          onToggle={() => handleToggle(6)}
          title="What are your interest rates and repayment terms ?"
        >
          Interest rates range from 7-15%, depending on several factors including type of GPU, Loan-to-Value ratio
          (&quot;LTV&quot;), and offtake arrangement. Loan principal is amortized straight line over three years, and
          prepayment is allowed at any time without penalty.
        </FaqItem>

        <FaqItem
          key={7}
          index={7}
          open={activeIndex === 7}
          onToggle={() => handleToggle(7)}
          title="Do you work with vendors or manufacturers directly ?"
        >
          GPULoans do not work directly with OEMs, but may be able to make introductions on your behalf. Additionally,
          the backstop of our financing may support receiving Net-30 payment terms, decreasing the up-front equity
          requirement.
        </FaqItem>

        <FaqItem
          key={8}
          index={8}
          open={activeIndex === 8}
          onToggle={() => handleToggle(8)}
          title="Do you finance used equipment ?"
        >
          GPULoans are happy to finance equipment less than two years old. GPULoans will value the asset at current
          market value, and lend against that partially depreciated basis.
        </FaqItem>

        <FaqItem
          key={9}
          index={9}
          open={activeIndex === 9}
          onToggle={() => handleToggle(9)}
          title="Do I need to insure the asset ?"
        >
          GPULoans insure our basis in the asset, with the premiums over the life of the loan capitalized into the
          up-front balance. If you would like to insure the asset separately, with yourself as loss payee, you are free
          to do so.
        </FaqItem>

        <FaqItem
          key={10}
          index={10}
          open={activeIndex === 10}
          onToggle={() => handleToggle(10)}
          title="What happens if I miss a payment ?"
        >
          If you miss a payment, there is a 30 day grace period at accelerated interest. If the full balance owed is not
          paid by the end of the grace-period, the tokenized warehouse receipts are auctioned on-chain, and the winner
          of the auction will take ownership of the GPUs, with our loan being paid down from proceeds.
        </FaqItem>

        <FaqItem
          key={11}
          index={11}
          open={activeIndex === 11}
          onToggle={() => handleToggle(11)}
          title="What happens if I want to upgrade my equipment ?"
        >
          GPULoans.com with GPULoans allows hardware upgrades through a structured process where you can sell existing
          GPUs, use proceeds to pay down the corresponding loan portion, and finance replacement hardware through a new
          transaction. This flexibility enables you to refresh your infrastructure as technology evolves without being
          locked into obsolete hardware for the full loan term.
        </FaqItem>

        <FaqItem
          key={12}
          index={12}
          open={activeIndex === 12}
          onToggle={() => handleToggle(12)}
          title="Can I use GPULoans.com financing for data center costs beyond just GPUs ?"
        >
          GPULoans.com financing focuses specifically on GPU hardware as the collateral asset. Some related
          infrastructure components like high-performance networking equipment or specialized cooling systems are also
          financed. Soft costs like software licensing and install are not included.
        </FaqItem>
      </ol>
    </div>
  );
}

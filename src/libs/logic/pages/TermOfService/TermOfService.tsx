import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function TermOfService() {
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-center text-black">
      <div className="flex z-10 max-w-[728px] min-w-[280px] flex-col flex-wrap flex-1 gap-10 marker:font-medium w-full min-h-screen max-md:justify-center text-left">
        <Link
          href="/"
          className="hidden gap-2 items-center text-secondary md:flex w-fit hover:text-primary transition-colors"
        >
          <ChevronLeftIcon className="w-5.5 h-5.5" />
          Back
        </Link>

        <div className="flex flex-col gap-3 md:gap-2 items-start">
          <h3 className="text-[40px]/none font-medium font-swiss text-brown-700">GPULOANS.COM TERMS OF SERVICE</h3>
          <h5 className="text-base md:text-lg italic font-light text-brown-500">Last Updated: 1/12/2026</h5>
        </div>

        <div className="flex flex-col gap-6 text-base">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website located at
            gpuloans.com (the &quot;Site&quot;) and any related services provided through the Site (collectively, the
            &quot;Services&quot;). The Site and Services are operated by USD.AI Foundation, a Cayman Islands foundation
            company (&quot;Foundation,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p>
            By accessing or using the Site or Services, you agree to be bound by these Terms. If you do not agree to
            these Terms, do not access or use the Site or Services.
          </p>

          <ol className="list-decimal list-outside ml-6 space-y-6 marker:text-secondary">
            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">DESCRIPTION OF SERVICES</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                The Site provides information about GPU-backed financing arrangements facilitated through the USD.AI
                Protocol. The Services include intake, due diligence coordination, structuring support, and ongoing
                servicing for such financing arrangements.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                GPU Loans is a service brand operated by the Foundation. The Foundation is not a bank, licensed lender,
                broker-dealer, or investment adviser. The Foundation does not provide loans directly. Rather, the
                Foundation facilitates access to the USD.AI Protocol, a decentralized structured credit protocol through
                which users may post collateral and draw liquidity.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">ELIGIBILITY</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                The Services are available only to businesses and individuals who can form legally binding contracts
                under applicable law. By using the Services, you represent and warrant that:
              </p>
              <ul className="list-[lower-alpha] list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  You are at least 18 years of age;
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  If acting on behalf of a business entity, you have the authority to bind that entity to these Terms;
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  You are not located in, or a resident of, any jurisdiction where the Services would be prohibited by
                  applicable law;
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  You are not subject to economic sanctions or designated on any prohibited party list maintained by any
                  governmental authority; and
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Your use of the Services will comply with all applicable laws and regulations.
                </li>
              </ul>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">NO OFFER; NO COMMITMENT</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                Nothing on the Site or in any communication from the Foundation or its service providers constitutes an
                offer to provide financing, a commitment to provide financing, or investment advice. All financing
                arrangements are subject to satisfactory completion of due diligence, execution of definitive
                documentation, and availability of protocol liquidity. Any term sheets, indicative terms, or other
                preliminary materials provided through the Services are non-binding and for discussion purposes only
                unless and until definitive agreements are executed by all parties.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">RELATIONSHIP WITH USD.AI PROTOCOL</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                The USD.AI Protocol is a decentralized protocol operating on public blockchain infrastructure. The
                Foundation facilitates access to the Protocol but does not control the Protocol&apos;s smart contracts
                or guarantee their performance. Your interaction with the Protocol is governed by the Protocol&apos;s
                terms and the smart contract code.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                You acknowledge and agree that:
              </p>
              <ul className="list-[lower-alpha] list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Blockchain-based systems involve inherent risks, including smart contract vulnerabilities, network
                  congestion, and market volatility;
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  The Foundation is not responsible for the operation, security, or performance of the Protocol;
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Draws from the Protocol are denominated in USDC or other stablecoins, which may fluctuate in value
                  relative to fiat currencies; and
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  You are solely responsible for understanding and evaluating the risks associated with your use of the
                  Protocol.
                </li>
              </ul>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">USER OBLIGATIONS</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                In connection with your use of the Services, you agree to:
              </p>
              <ul className="list-[lower-alpha] list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Provide accurate, complete, and current information as requested;
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Promptly update any information that becomes inaccurate or incomplete;
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Cooperate with all due diligence and know-your-customer (KYC) procedures;
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Comply with all applicable laws and regulations, including anti-money laundering and sanctions laws;
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Not use the Services for any unlawful purpose or in violation of these Terms; and
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Not attempt to circumvent any security measures or access controls.
                </li>
              </ul>

              <p className="text-base normal-case font-normal text-text-primary mt-4">
                Users seeking financing through the USD.AI Protocol and GPU Loans may need to create a separate special
                purpose legal entity (&quot;SPV&quot;) for the purpose of holding collateral and transacting with the
                Protocol.
              </p>

              <p className="text-base normal-case font-normal text-text-primary mt-2">
                By accepting these Terms and utilizing the Protocol, each User (and any SPV established for the purpose
                of holding collateral) represents, warrants, and covenants as follows:
              </p>

              <p className="text-base normal-case font-semibold text-text-primary mt-4">
                Acknowledgment of Lender Reliance on SPV Structure:
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">User acknowledges that:</p>
              <ul className="list-[lower-alpha] list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Lenders and liquidity providers to the Protocol are relying on the bankruptcy-remote status of any SPV
                  established to hold collateral
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Such reliance is a material inducement to lenders&apos; provision of funds
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  User is entering into this financing arrangement with the intent that the SPV will remain bankruptcy
                  remote from User and User&apos;s other affiliates
                </li>
              </ul>

              <p className="text-base normal-case font-semibold text-text-primary mt-4">True Sale:</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                To the extent User transfers any assets (including but not limited to GPU equipment, tokenized warehouse
                receipts, or other collateral) to an SPV:
              </p>
              <ul className="list-[lower-alpha] list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Such transfer constitutes an absolute sale and transfer of all right, title, and interest in such
                  assets
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  User has transferred all economic risk of ownership to the SPV
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  The transfer is not intended as, and shall not be recharacterized as, a secured financing, loan, or
                  pledge by User to the SPV
                </li>
              </ul>

              <p className="text-base normal-case font-semibold text-text-primary mt-4">Separateness Covenants:</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">User shall cause any SPV to:</p>
              <ul className="list-[lower-alpha] list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Maintain separate books, records, and accounts from User and all affiliates
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Hold itself out to the public as a separate legal entity
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Maintain separate bank accounts and not commingle funds with User or affiliates
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Observe all organizational formalities including maintaining an Independent Manager (where applicable)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Not guarantee or become liable for obligations of User or any affiliate
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  File separate tax returns (or be included in consolidated returns with appropriate notation of
                  separate existence)
                </li>
              </ul>

              <p className="text-base normal-case font-semibold text-text-primary mt-4">No Petition Covenant:</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                User covenants that it shall not, directly or indirectly:
              </p>
              <ul className="list-[lower-alpha] list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  File, or cause to be filed, any bankruptcy, insolvency, or similar petition against any SPV
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Take any action with intent to hinder, delay, or defraud creditors of any SPV
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Prior to the expiration of one (1) year and one (1) day after payment in full of all obligations
                  secured by the SPV&apos;s assets, commence or support any involuntary bankruptcy proceeding against
                  the SPV
                </li>
              </ul>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">INTELLECTUAL PROPERTY</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                The Site and its contents, including text, graphics, logos, images, and software, are the property of
                the Foundation or its licensors and are protected by copyright, trademark, and other intellectual
                property laws. You may not reproduce, distribute, modify, or create derivative works from any content on
                the Site without our prior written consent.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                &quot;GPU Loans&quot; and &quot;USD.AI&quot; are trademarks of the Foundation. You may not use these
                marks without our prior written consent.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">DISCLAIMERS</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                THE SITE AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF
                ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                THE FOUNDATION DOES NOT WARRANT THAT THE SITE OR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE,
                OR THAT ANY DEFECTS WILL BE CORRECTED. THE FOUNDATION DOES NOT WARRANT THE ACCURACY, COMPLETENESS, OR
                RELIABILITY OF ANY INFORMATION PROVIDED THROUGH THE SITE OR SERVICES.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                THE FOUNDATION IS NOT A FIDUCIARY WITH RESPECT TO ANY USER. NOTHING IN THESE TERMS OR ON THE SITE
                CREATES A FIDUCIARY RELATIONSHIP BETWEEN THE FOUNDATION AND ANY USER.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">LIMITATION OF LIABILITY</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE FOUNDATION, ITS DIRECTORS,
                OFFICERS, EMPLOYEES, AGENTS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF
                OR RELATED TO YOUR USE OF THE SITE OR SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING
                NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                THE FOUNDATION&apos;S TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR YOUR
                USE OF THE SITE OR SERVICES SHALL NOT EXCEED ONE HUNDRED U.S. DOLLARS ($100).
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">INDEMNIFICATION</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                You agree to indemnify, defend, and hold harmless the Foundation and its directors, officers, employees,
                agents, and service providers from and against any claims, liabilities, damages, losses, costs, and
                expenses (including reasonable attorneys&apos; fees) arising out of or related to: (a) your use of the
                Site or Services; (b) your violation of these Terms; (c) your violation of any applicable law or
                regulation; or (d) your violation of any rights of a third party.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">GOVERNING LAW AND DISPUTE RESOLUTION</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                These Terms shall be governed by and construed in accordance with the laws of the Cayman Islands,
                without regard to its conflict of laws principles.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                Any dispute arising out of or relating to these Terms or your use of the Site or Services shall be
                resolved exclusively in the courts of the Cayman Islands, and you consent to the personal jurisdiction
                of such courts.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                Notwithstanding the foregoing, the Foundation may seek injunctive or other equitable relief in any court
                of competent jurisdiction to protect its intellectual property rights or confidential information.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">MODIFICATIONS</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                The Foundation reserves the right to modify these Terms at any time. If we make material changes, we
                will update the &quot;Last Updated&quot; date at the top of these Terms and, where appropriate, provide
                additional notice. Your continued use of the Site or Services after any modification constitutes your
                acceptance of the modified Terms.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">GENERAL PROVISIONS</span>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Entire Agreement.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                These Terms, together with any applicable Customer Services Agreement and Protocol terms, constitute the
                entire agreement between you and the Foundation regarding the subject matter hereof.
              </p>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Severability.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall
                continue in full force and effect.
              </p>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Waiver.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                The Foundation&apos;s failure to enforce any right or provision of these Terms shall not constitute a
                waiver of such right or provision.
              </p>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Assignment.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                You may not assign these Terms or any rights hereunder without the Foundation&apos;s prior written
                consent. The Foundation may assign these Terms without restriction.
              </p>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">
                No Third-Party Beneficiaries.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                These Terms do not create any third-party beneficiary rights.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">CONTACT INFORMATION</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="text-base normal-case font-normal text-text-primary mt-4 space-y-1">
                <p className="font-semibold">USD.AI Foundation</p>
                <p>PO Box 10061</p>
                <p>George Town Financial Center</p>
                <p>90 Fort Street, Suite 306</p>
                <p>Grand Cayman, KY1-1001</p>
                <p>Cayman Islands</p>
                <p className="mt-4">
                  <span className="font-semibold">Email:</span>{" "}
                  <a href="mailto:hello@usd.ai" className="text-primary hover:text-primary hover:underline">
                    hello@usd.ai
                  </a>
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}

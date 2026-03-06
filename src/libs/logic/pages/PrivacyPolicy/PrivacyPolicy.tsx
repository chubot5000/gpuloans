import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function PrivacyPolicy() {
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
          <h3 className="text-[40px]/none font-medium font-swiss text-brown-700">GPULOANS.COM PRIVACY POLICY</h3>
          <h5 className="text-base md:text-lg italic font-light text-brown-500">Last Updated: January 12, 2026</h5>
        </div>

        <div className="flex flex-col gap-6 text-base">
          <p>
            This Privacy Policy describes how USD.AI Foundation, a Cayman Islands foundation company
            (&quot;Foundation,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), collects, uses, and shares
            information in connection with the website located at gpuloans.com (the &quot;Site&quot;) and related
            services (collectively, the &quot;Services&quot;).
          </p>
          <p>
            By accessing or using the Site or Services, you acknowledge that you have read and understood this Privacy
            Policy. If you do not agree to this Privacy Policy, please do not use the Site or Services.
          </p>

          <ol className="list-decimal list-outside ml-6 space-y-6 marker:text-secondary">
            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">INFORMATION WE COLLECT</span>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Information You Provide</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Contact information (name, email address, phone number, business address)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Business information (company name, role, industry)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Financial information (asset details, operational data, revenue information)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Identity verification information (government-issued ID, proof of address, beneficial ownership
                  information)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Communications (emails, messages, and other correspondence with us)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Any other information you choose to provide
                </li>
              </ul>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">
                Information Collected Automatically
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                When you access the Site, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Device information (IP address, browser type, operating system)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Usage information (pages viewed, time spent on Site, referring URL)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Location information (approximate location based on IP address)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Cookies and similar technologies (see Section 5 below)
                </li>
              </ul>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">
                Information from Third Parties
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                We may receive information about you from third parties, including:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">Identity verification services</li>
                <li className="text-base normal-case font-normal text-text-primary">Credit reference agencies</li>
                <li className="text-base normal-case font-normal text-text-primary">Sanctions screening databases</li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Publicly available sources (websites, public records, social media)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Business partners and referral sources
                </li>
              </ul>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">HOW WE USE YOUR INFORMATION</span>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">
                To Provide and Improve the Services
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Processing inquiries and applications
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Conducting due diligence and underwriting
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Facilitating financing arrangements
                </li>
                <li className="text-base normal-case font-normal text-text-primary">Providing customer support</li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Improving and developing the Services
                </li>
              </ul>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">
                For Compliance and Legal Purposes
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Verifying your identity (KYC procedures)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Complying with anti-money laundering and sanctions requirements
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Responding to regulatory inquiries and legal process
                </li>
                <li className="text-base normal-case font-normal text-text-primary">Detecting and preventing fraud</li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Enforcing our terms and agreements
                </li>
              </ul>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">For Communications</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Sending transactional communications
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Providing updates about the Services
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Marketing communications (with your consent where required)
                </li>
              </ul>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">For Our Legitimate Interests</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Analyzing usage patterns and trends
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Protecting our rights and property
                </li>
                <li className="text-base normal-case font-normal text-text-primary">Managing business operations</li>
              </ul>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">HOW WE SHARE YOUR INFORMATION</span>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Service Providers.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                We share information with third parties who perform services on our behalf, including identity
                verification providers, data center operators, professional advisors, and technology providers. These
                parties are contractually obligated to use your information only for the purposes of providing services
                to us.
              </p>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Affiliates and Partners.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                We may share information with our affiliates and business partners, including Permian Labs, Inc. (our
                service provider) and entities involved in financing arrangements.
              </p>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Protocol Participants.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                Certain information may be visible on public blockchains in connection with your use of the USD.AI
                Protocol, including wallet addresses and transaction data.
              </p>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Legal and Regulatory.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                We may disclose information to comply with applicable laws, regulations, or legal process, or to respond
                to requests from regulatory authorities, tax authorities, or law enforcement.
              </p>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">Business Transfers.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                We may share information in connection with a merger, acquisition, reorganization, or sale of assets.
              </p>
              <p className="text-base normal-case font-semibold text-text-primary mt-2">With Your Consent.</p>
              <p className="text-base normal-case font-normal text-text-primary mt-1">
                We may share information with your consent or at your direction.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">INTERNATIONAL TRANSFERS</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                The Foundation is based in the Cayman Islands, and our service providers may be located in various
                jurisdictions around the world, including the United States. By using the Services, you consent to the
                transfer of your information to jurisdictions that may have different data protection laws than your
                jurisdiction of residence.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                Where required by applicable law, we implement appropriate safeguards for international transfers, such
                as standard contractual clauses.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">COOKIES AND TRACKING TECHNOLOGIES</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                We use cookies and similar technologies to collect information and improve the Services. Cookies are
                small data files stored on your device that help us recognize you and remember your preferences.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                We use the following types of cookies:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  Essential Cookies: Required for the Site to function properly
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Analytics Cookies: Help us understand how visitors use the Site
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Functional Cookies: Remember your preferences and settings
                </li>
              </ul>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                You can manage your cookie preferences through your browser settings. Note that disabling certain
                cookies may affect the functionality of the Site.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">DATA RETENTION</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                We retain your information for as long as necessary to fulfill the purposes for which it was collected,
                including to satisfy legal, regulatory, accounting, or reporting requirements. The retention period may
                vary depending on the context and our legal obligations.
              </p>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                When determining retention periods, we consider:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  The nature and sensitivity of the information
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  The purposes for which we process the information
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Applicable legal and regulatory requirements
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  Statute of limitations for potential claims
                </li>
              </ul>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">DATA SECURITY</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                We implement appropriate technical and organizational measures to protect your information against
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
                internet or electronic storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">YOUR RIGHTS</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                Depending on your jurisdiction, you may have certain rights regarding your personal information,
                including:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2 marker:text-text-primary">
                <li className="text-base normal-case font-normal text-text-primary">
                  The right to access your personal information
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  The right to correct inaccurate information
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  The right to delete your information (subject to legal retention requirements)
                </li>
                <li className="text-base normal-case font-normal text-text-primary">
                  The right to restrict or object to processing
                </li>
                <li className="text-base normal-case font-normal text-text-primary">The right to data portability</li>
                <li className="text-base normal-case font-normal text-text-primary">
                  The right to withdraw consent (where processing is based on consent)
                </li>
              </ul>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                To exercise these rights, please contact us using the information provided below. We may request
                verification of your identity before responding to your request.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">CHILDREN&apos;S PRIVACY</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                The Services are not intended for individuals under the age of 18, and we do not knowingly collect
                personal information from children. If we become aware that we have collected information from a child,
                we will take steps to delete it.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">THIRD-PARTY LINKS</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                The Site may contain links to third-party websites or services. We are not responsible for the privacy
                practices of these third parties, and we encourage you to review their privacy policies.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">CHANGES TO THIS PRIVACY POLICY</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                We may update this Privacy Policy from time to time. If we make material changes, we will update the
                &quot;Last Updated&quot; date and, where appropriate, provide additional notice. Your continued use of
                the Services after any changes constitutes your acceptance of the updated Privacy Policy.
              </p>
            </li>

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">CONTACT US</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
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

            <li className="mb-2">
              <span className="text-lg uppercase font-medium text-secondary">CAYMAN ISLANDS DATA PROTECTION</span>
              <p className="text-base normal-case font-normal text-text-primary mt-2">
                For individuals whose personal data is processed under the Cayman Islands Data Protection Act (as
                amended), the Foundation is the data controller. You have certain rights under the Act, including the
                right to be informed about processing, to access your data, to have inaccurate data corrected, and to
                complain to the Office of the Ombudsman.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}

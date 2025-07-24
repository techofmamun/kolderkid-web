
import React from "react";
import PageContainer from "../components/PageContainer";


const Terms: React.FC = () => (
  <PageContainer>
    <div className="prose max-w-2xl text-gray-700">
      <h2 className="text-xl font-semibold mt-4 mb-2">1. Acceptance of Terms</h2>
      <p>
        By accessing or using Kolderkid Universe, you agree to abide by these Terms &amp; Conditions. If you do not agree, please discontinue using the app.
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">2. User Registration &amp; Account</h2>
      <ul className="list-disc ml-6">
        <li>Users must be at least 13 years old to register.</li>
        <li>You are responsible for maintaining account security.</li>
        <li>You may not share your account credentials with others.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">3. Content &amp; Usage</h2>
      <ul className="list-disc ml-6">
        <li>Users can upload music, videos, and apparel for promotional purposes.</li>
        <li>All uploaded content must comply with copyright laws.</li>
        <li>Kolderkid Universe is not responsible for any copyright violations by users.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">4. Purchases &amp; Refunds</h2>
      <ul className="list-disc ml-6">
        <li>All purchases of digital content and merchandise are final.</li>
        <li>Refunds will only be processed in cases of accidental duplicate transactions.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">5. Prohibited Activities</h2>
      <ul className="list-disc ml-6">
        <li>Uploading offensive, violent, or illegal content.</li>
        <li>Using the app for spamming, hacking, or fraudulent activities.</li>
        <li>Misusing or attempting to reverse-engineer the app.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">6. Account Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts found in violation of our terms without prior notice.
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">7. Liability Disclaimer</h2>
      <p>
        Kolderkid Universe is provided "as is" without warranties of any kind. We are not responsible for any damages arising from app usage.
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">8. Changes to Terms</h2>
      <p>
        These terms may be updated periodically. Continued use of the app constitutes acceptance of the latest terms.
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">9. Contact Information</h2>
      <p>
        For any questions, reach out to <a href="mailto:support@kolderkid.com">support@kolderkid.com</a>.
      </p>
    </div>
  </PageContainer>
);

export default Terms;

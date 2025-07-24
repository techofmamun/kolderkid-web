
import React from "react";
import PageContainer from "../components/PageContainer";


const PrivacyPolicy: React.FC = () => (
  <PageContainer>
    <div className="prose max-w-2xl text-gray-700">
      <h2 className="text-xl font-semibold mt-4 mb-2">1. Introduction</h2>
      <p>
        Welcome to Kolderkid Universe. Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information when you use our mobile application. By using Kolderkid Universe, you agree to the collection and use of information in accordance with this policy.
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">2. Information We Collect</h2>
      <ul className="list-disc ml-6">
        <li><b>Personal Information:</b> When you register, we collect details such as your name, email address, and profile picture.</li>
        <li><b>Usage Data:</b> We track user activities such as music/video plays, purchases, and downloads.</li>
        <li><b>Device Information:</b> We may collect device model, operating system, and IP address for app performance optimization.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">3. How We Use Your Information</h2>
      <ul className="list-disc ml-6">
        <li>Provide and improve app functionality.</li>
        <li>Personalize your experience.</li>
        <li>Enable purchases, downloads, and profile management.</li>
        <li>Send important updates and promotional offers (with user consent).</li>
        <li>Prevent fraudulent activities and enforce our terms of use.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">4. Data Sharing & Security</h2>
      <ul className="list-disc ml-6">
        <li>We do not sell your data to third parties. We only share necessary information with:</li>
        <ul className="list-disc ml-10">
          <li>Payment processors for transactions.</li>
          <li>Cloud storage services for secure data storage.</li>
        </ul>
        <li>Your data is encrypted and stored securely.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">5. User Rights</h2>
      <ul className="list-disc ml-6">
        <li>Access, update, or delete your personal data.</li>
        <li>Withdraw consent for marketing communications.</li>
        <li>Request data deletion by contacting us at <a href="mailto:support@kolderkid.com">support@kolderkid.com</a>.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">6. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Users will be notified of major changes through the app.
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">7. Contact Us</h2>
      <p>
        For any privacy-related inquiries, please email us at <a href="mailto:support@kolderkid.com">support@kolderkid.com</a>.
      </p>
    </div>
  </PageContainer>
);

export default PrivacyPolicy;

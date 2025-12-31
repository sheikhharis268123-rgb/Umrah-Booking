
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const faqs = [
    {
        question: "How do I book a hotel?",
        answer: "You can book a hotel by using the search bar on our home page. Select your city, check-in, and check-out dates, and click 'Search'. Browse the available hotels, select a room, and click 'Book Now' to proceed with your details."
    },
    {
        question: "How can I check my booking status?",
        answer: "Navigate to the 'Track Booking' page from the main menu. Enter your Booking ID (which you received in your confirmation email) into the search field to see the current status of your reservation."
    },
    {
        question: "What payment methods are accepted?",
        answer: "We currently support mock payment processing for demonstration purposes. In a live environment, we would accept all major credit cards, debit cards, and other secure online payment methods."
    },
    {
        question: "Can I cancel my booking?",
        answer: "Booking cancellation policies vary by hotel. For this demo application, an admin can manually change a booking status to 'Cancelled' in the admin portal. In a real application, customers would have an option to request cancellation based on the hotel's policy."
    },
    {
        question: "When can I download my voucher?",
        answer: "Your booking voucher will be available for download as soon as your booking status is 'Confirmed'. You can access it from the 'My Bookings' page or by tracking your booking on the 'Track Booking' page."
    }
];

const FAQItem: React.FC<{ faq: { question: string, answer: string } }> = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-2 focus:outline-none"
            >
                <span className="text-lg font-medium text-primary">{faq.question}</span>
                <span className="transform transition-transform duration-300">
                    {isOpen ? 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg> : 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    }
                </span>
            </button>
            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="p-4 pt-0 text-gray-600">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
};

const SupportPage = () => {
    return (
        <>
            <Header title="Support" />
            <main className="py-12 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-primary">How can we help?</h1>
                        <p className="mt-2 text-lg text-gray-600">Find answers to your questions or get in touch with our team.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold text-primary mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-2">
                                {faqs.map((faq, index) => <FAQItem key={index} faq={faq} />)}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md self-start">
                             <h2 className="text-2xl font-semibold text-primary mb-6">Contact Information</h2>
                             <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Email Us</h3>
                                    <p className="text-secondary hover:underline">support@umrahhotels.com</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Call Us</h3>
                                    <p className="text-gray-600">+966 12 345 6789</p>
                                </div>
                                 <div>
                                    <h3 className="font-semibold text-gray-700">Address</h3>
                                    <p className="text-gray-600">King Abdul Aziz Endowment, Makkah 21955, Saudi Arabia</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default SupportPage;

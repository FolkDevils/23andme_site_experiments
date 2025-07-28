'use client';

import { useState } from 'react';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem(props: FaqItemProps) {
  const { question, isOpen, onToggle } = props;
  return (
    <div className="backdrop-blur-sm bg-white/10 border border-black/10 rounded-3xl w-full transition-all duration-300 ease-in-out">
      <div className="p-6">
        <button
          onClick={onToggle}
          className="flex items-start justify-between w-full text-left"
          aria-expanded={isOpen}
        >
          <div 
            className="font-rialta text-text-primary pr-4 flex-1"
            style={{
              fontSize: 'var(--font-size-faq-question)',
              lineHeight: 'var(--line-height-faq-question)'
            }}
          >
            {question}
          </div>
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
            {isOpen ? (
              <div className="w-5 h-5 rotate-45 transition-transform duration-300">
                <svg
                  className="block w-full h-full"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 0V20M0 10H20"
                    stroke="#282828"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-5 h-5 transition-transform duration-300">
                <svg
                  className="block w-full h-full"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 0V20M0 10H20"
                    stroke="#555555"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            )}
          </div>
        </button>
        
        {isOpen && (
          <div 
            className="mt-6 font-rialta text-text-secondary"
            style={{
              fontSize: 'var(--font-size-faq-answer)',
              lineHeight: 'var(--line-height-faq-answer)'
            }}
          >
            <p className="mb-4">
              To be eligible for 23andMe+ Total Health, you must be 18 years or older and live in the US - excluding HI, NJ, NY, RI and US territories (due to state and regional restrictions). You must not have received a blood transfusion in the last 30 days or a bone marrow transplant.
            </p>
            <p>
              Currently, Total Health is only available to new, non-genotyped customers. If you&apos;re a current customer, we&apos;re still in the process of building an upgrade path for you to upgrade within your current account. We want to ensure all the foundations are in place for you to have an optimal experience with the service at a special upgrade price.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface FAQProps {
  title?: string;
}

export default function FAQ({ 
  title = "Things you might be wondering:" 
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqData = [
    {
      question: "Who is eligible for 23andMe+ Total Health?",
      answer: "Default answer content for all FAQ items..."
    },
    {
      question: "Who is eligible for 23andMe+ Total Health?",
      answer: "Default answer content for all FAQ items..."
    },
    {
      question: "Who is eligible for 23andMe+ Total Health?",
      answer: "Default answer content for all FAQ items..."
    },
    {
      question: "Who is eligible for 23andMe+ Total Health?",
      answer: "Default answer content for all FAQ items..."
    },
    {
      question: "Who is eligible for 23andMe+ Total Health?",
      answer: "Default answer content for all FAQ items..."
    },
    {
      question: "Who is eligible for 23andMe+ Total Health?",
      answer: "Default answer content for all FAQ items..."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-10">
        <div className="flex flex-col gap-12">
          {/* Title */}
          <h2 className="font-rialta font-light text-text-primary tracking-tight text-faq-title">
            {title}
          </h2>
          
          {/* FAQ List */}
          <div className="flex flex-col gap-2">
            {faqData.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 